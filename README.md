# Advanced Solana Token Sniper

## Overview

Introducing a sophisticated Solana token sniper script designed for automated token acquisition on the Solana blockchain. Tailor its behavior with numerous configurable settings, optimizing your trading strategy.

## Getting Started

1. **RPC Configuration**

   - Configure your RPC endpoints with your provider credentials. Integrations with Shyft API are supported via API key.

   ```yaml
   RPC_WEBSOCKET_ENDPOINT: "wss://rpc.shyft.to?api_key=YOUR_API_KEY"
   RPC_ENDPOINT: "https://rpc.shyft.to?api_key=YOUR_API_KEY"
   ```
  
2. **Wallet Integration**

   - Insert your wallet's secret key for seamless interaction. This key can typically be generated via wallet services or Telegram bots.

   ```yaml
   SNIPER_SECRET_KEY: <your_secret_key>
   ```

3. **Purchase Configuration**

   - Fine-tune purchasing parameters to suit your trading strategy, including SOL allocation, transaction tips, and retry logic.

   ```yaml
   BUY_AMOUNT_SOL: 0.02
   JITO_TIP_AMOUNT: 0.005
   MIN_SOL_REQUIRED: 0.1
   MAX_BUY_RETRIES: 2
   BUY_DELAY: 0
   ```

4. **Rug Pull Protection**

   - Customize filters to safeguard against potential rug pulls, setting criteria for liquidity and owner distribution.

   ```yaml
   MIN_SOL_LP: 6
   MAX_SOL_LP: 20
   MIN_TOKEN_LP_PERCENTAGE: 70
   MAX_TOP10_HOLDERS_PERCENTAGE: 30
   MAX_SINGLE_OWNER_PERCENTAGE: 10
   ```

5. **Rug Check Activation**

   - Activate or deactivate specific rug check features tailored to your risk tolerance and operational needs.

   ```yaml
   ENABLE_RUG_CHECKS: true
   CHECK_MINTABLE_AND_FREEZABLE: true
   CHECK_TOP10_HOLDERS_PERCENTAGE: true
   CHECK_BURN: false
   CHECK_IF_SOCIALS: false
   ```

6. **Sniper List Options**

   - Define sniper list preferences, adjust refresh intervals, and apply token symbol filters as necessary.

   ```yaml
   SNIPE_LIST_REFRESH_INTERVAL: 30000
   TOKEN_SYMBOL_FILTER: "BONK"

   USE_SNIPE_LIST: false
   CHECK_TOKEN_SYMBOL: false
   ```

7. **Telegram Bot Configuration**
   - Set up a Telegram bot for autonomous token trading. Populate the relevant fields with your Telegram API credentials and bot details.
   ```yaml
   TG_API_ID:
   TG_API_HASH:
   TG_SESSION_ID:
   TG_BOT_USERNAME: "@hector_trojanbot"
   ```

Maximize your token acquisition efficiency on the Solana blockchain with this powerful sniping tool, meticulously designed to align with your strategic priorities and risk management protocols.
