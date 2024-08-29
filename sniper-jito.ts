import dotenv from "dotenv";
import path from "path";
import { Connection, Keypair } from "@solana/web3.js";
import bs58 from "bs58";

import { Currency, CurrencyAmount, LiquidityPoolKeysV4, TokenAmount } from "@raydium-io/raydium-sdk";
import BN, { min } from "bn.js";
import {
	checkSolBalance,
	getTokenMetadataInfo,
	initializeConfigurations,
	logErrorToFile,
	promptUserConfiguration,
	rugCheck,
	setupSnipeListMonitoring,
	sleep,
	storeData,
} from "./utils";
import base58 from "bs58";
import {
	BUY_AMOUNT_SOL,
	BUY_DELAY,
	CHECK_TOKEN_SYMBOL,
	ENABLE_RUG_CHECKS,
	MAX_SINGLE_OWNER_PERCENTAGE,
	MAX_SOL_LP,
	MIN_SOL_LP,
	MIN_SOL_REQUIRED,
	MIN_TOKEN_LP_PERCENTAGE,
	TOKEN_SYMBOL_FILTER,
	USE_PENDING_SNIPE_LIST,
	logger,
	rayFee,
	sniperWallet,
	solanaConnection,
} from "./constants";
import { buyToken, extractMarketAndLpInfoFromLogs, getPoolKeysFromMarketId } from "./swapUtils";

dotenv.config();

/**storage */
const newDataPath = path.join(__dirname, "sniper_data", "bought_tokens.json");

const seenSignatures = new Set<string>();

let pendingSnipeList: string[] = [];

let tokenSymbolToSnipe = TOKEN_SYMBOL_FILTER.toLowerCase();

async function monitorNewTokens(connection: Connection, sniperWallet: Keypair) {
	try {
		await initializeConfigurations();
		setupSnipeListMonitoring(pendingSnipeList, logger);

		logger.info(`monitoring new solana tokens...`);

		connection.onLogs(
			rayFee,
			async ({ logs, err, signature }) => {
				try {
					const websocketRecievedTimestamp = new Date().toISOString();

					const websocketReceivedTime = Math.floor(new Date().getTime() / 1000);

					if (err) {
						return;
					}
					if (seenSignatures.has(signature)) {
						return;
					}

					logger.info(`found new token signature: ${signature}`);

					let signer = "";
					let poolKeys: LiquidityPoolKeysV4 & {
						poolOpenTime: any;
					};

					/**You need to use a RPC provider for getparsedtransaction to work properly.
					 * Check README.md for suggestions.
					 */
					const parsedTransaction = await connection.getParsedTransaction(signature, {
						maxSupportedTransactionVersion: 0,
						commitment: "confirmed",
					});

					if (parsedTransaction && parsedTransaction?.meta.err == null) {
						logger.info(`successfully parsed transaction for signature: ${signature}`);

						signer = parsedTransaction?.transaction.message.accountKeys[0].pubkey.toString();

						const lpInfo = extractMarketAndLpInfoFromLogs(logs);

						/**extract pool keys */

						poolKeys = await getPoolKeysFromMarketId(lpInfo.marketId, connection);

						if (!poolKeys) {
							throw new Error(`unable to extract poolkeys for signature: ${signature}`);
						}

						const initPoolBlockTime = parsedTransaction?.blockTime;

						const poolOpenTime = parseInt(poolKeys.poolOpenTime.toString());

						logger.info(
							`pool open time: ${poolOpenTime}. websocket received time: ${websocketReceivedTime}. open time later than websocket received time?: ${
								poolOpenTime > websocketReceivedTime
							}`
						);

						if (!USE_PENDING_SNIPE_LIST) {
							if (poolOpenTime > websocketReceivedTime) {
								logger.info(
									`Open time of pool ${lpInfo.openTime} is later than websocket received time ${websocketReceivedTime} for mint: ${poolKeys.baseMint}. Exiting the function.`
								);
								return;
							}
						}

						//check if token is in snipe list
						if (USE_PENDING_SNIPE_LIST) {
							logger.info(`current pending token list: ${pendingSnipeList}`);

							if (pendingSnipeList.includes(poolKeys.baseMint.toString())) {
								logger.info(`Found token ${poolKeys.baseMint.toString()} in pending snipe list.`);

								const currentTime = Math.floor(new Date().getTime() / 1000);
								const delayMs = (poolOpenTime - currentTime) * 1000;

								//check if pool open time is in the future
								if (delayMs > 0) {
									logger.info(`Pool open time is in the future for ${poolKeys.baseMint.toString()}. Delaying txn until pool open time for ${delayMs / 1000} seconds.`);
									await sleep(delayMs);
									logger.info(`Pool open time delay complete for ${poolKeys.baseMint.toString()}. Executing rest of function now...`);
								}
							} else if (CHECK_TOKEN_SYMBOL) {
								const tokenMetadataInfo = await getTokenMetadataInfo(connection, poolKeys.baseMint.toString());

								if (tokenMetadataInfo && tokenMetadataInfo.symbol) {
									if (tokenMetadataInfo.symbol.toLowerCase() === tokenSymbolToSnipe) {
										logger.info(`Found token ${poolKeys.baseMint.toString()} with symbol ${tokenMetadataInfo.symbol} in pending snipe list.`);
									} else {
										logger.info(`Skipping token ${poolKeys.baseMint.toString()}. Token symbol ${tokenMetadataInfo.symbol} does not match ${tokenSymbolToSnipe}.`);
										return;
									}
								} else {
									logger.info(`Skipping token ${poolKeys.baseMint.toString()}. Unable to retrieve the Token symbol info.`);
									return;
								}
							} else {
								logger.info(`Skipping token ${poolKeys.baseMint.toString()}. Not in pending snipe list.`);
								return;
							}
						}

                    }
                }
            }

    }
}

monitorNewTokens();

//discord.gg/solana-scripts