#!/bin/bash

echo -e "\033[0;32m" "Welcome to the polkaHack CLI - Alpha Version 0.01" "\033[1;37m"

PS3="> Enter your favorite Chain: "

select character in Interlay Moonbeam Astar Acala Kilt SubSocial
do
    if [ $character = Interlay ]
    then
      echo ""
      echo -e "\033[0;34m""Interlay is one-stop-shop for Bitcoin DeFi""\033[1;37m" 
      echo "Start with Interlay here:"
      echo "https://docs.interlay.io/#/getting-started/interlay-101"
      echo ""
    fi
    if [ $character = Moonbeam ]
    then
      echo ""
      echo -e "\033[0;34m""Moonbeam is the Ethereum Chain on Polkadot""\033[1;37m" 
      echo "Start with Moonbeam here:"
      echo "https://docs.moonbeam.network/builders/get-started/"
      echo ""
    fi
    if [ $character = Astar ]
    then
      echo ""
      echo -e "\033[0;34m""Astar is the WASM Smart Contract Chain on Polkadot""\033[1;37m" 
      echo "Start with Astar here:"
      echo "https://docs.astar.network/docs/getting-started"
      echo ""
    fi
    if [ $character = Acala ]
    then
      echo ""
      echo -e "\033[0;34m""Acala is the Defi Chain on Polkadot""\033[1;37m" 
      echo "Start with Acala here:"
      echo "https://evmdocs.acala.network/"
      echo ""
    fi
    if [ $character = Kilt ]
    then
      echo ""
      echo -e "\033[0;34m""Kilt is the Identity Chain on Polkadot""\033[1;37m" 
      echo "Start with Kilt here:"
      echo "https://docs.kilt.io/docs/develop/sdk/quickstart"
      echo ""
    fi
    if [ $character = SubSocial ]
    then
      echo ""
      echo -e "\033[0;34m""SubSocial is the Social Chain on Polkadot""\033[1;37m" 
      echo "Start with SubSocial here:"
      echo "https://docs.subsocial.network/docs/develop/"
      echo ""
    fi
done


