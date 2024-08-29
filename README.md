# Solana Token Sniper Script

This Solana token sniper script is designed to automatically buy tokens on Solana using a variety of customizable filters and settings. The script supports multiple configuration options, allowing you to tailor the behavior to your specific needs.

## How to Use

1. **Join Discord**  
   Join our Discord channel for the full documentation and support - https://discord.gg/solana-scripts

2. **Set Up RPC Endpoints**  
   Replace the placeholders with your own RPC provider endpoints. For example, you can use the Shyft API with your own API key.
   ```
   RPC_WEBSOCKET_ENDPOINT= "wss://rpc.shyft.to?api_key=YOUR_API_KEY"
   RPC_ENDPOINT= "https://rpc.shyft.to?api_key=YOUR_API_KEY"
   ```
4. **Enter Your Wallet Secret Key**  
   Replace with your wallet's secret key, which can be exported from wallet providers or Telegram bots.
   ```
   SNIPER_SECRET_KEY=
   ```
6. **Configure Buying Options**  
   Adjust the amount of SOL to use for purchasing tokens, tip amount, minimum SOL required in your wallet, and other buying behaviors.
   ```
   BUY_AMOUNT_SOL=0.02 
   JITO_TIP_AMOUNT=0.005 
   MIN_SOL_REQUIRED=0.1 
   MAX_BUY_RETRIES=2 
   BUY_DELAY=0 ```

8. **Set Rug Check Filters**  
   Fine-tune your filters to avoid potential rug pulls by setting minimum and maximum SOL used in liquidity pools, token distribution, and ownership percentages.
  ```
   MIN_SOL_LP=6  
   MAX_SOL_LP=20 
   MIN_TOKEN_LP_PERCENTAGE=70 
   MAX_TOP10_HOLDERS_PERCENTAGE=30 
   MAX_SINGLE_OWNER_PERCENTAGE=10
   ```

9. **Enable Rug Check Toggles**  
   Toggle individual rug checks based on your preferences.
   ```
   ENABLE_RUG_CHECKS=true 
   CHECK_MINTABLE_AND_FREEZABLE=true 
   CHECK_TOP10_HOLDERS_PERCENTAGE=true
   CHECK_BURN=false
   CHECK_IF_SOCIALS=false
   ```

11. **Snipe List Filters and Toggles**  
   Configure snipe list behavior, including refresh intervals, token symbol filters, and whether to use the snipe list file.
   ```
   SNIPE_LIST_REFRESH_INTERVAL=30000 
   TOKEN_SYMBOL_FILTER="BONK" 

   USE_SNIPE_LIST=false 
   CHECK_TOKEN_SYMBOL=false
   ```

11. **Telegram Settings**  
   Set up a Telegram sniper bot to buy and sell tokens automatically on your behalf. Fill in your Telegram API details and the bot username.
   ```
   TG_API_ID=
   TG_API_HASH=
   TG_SESSION_ID=
   TG_BOT_USERNAME='@hector_trojanbot'
   ```

More info on our discord - [Discord](https://discord.gg/solana-scripts)
