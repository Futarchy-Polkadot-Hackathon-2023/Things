#!/bin/bash

echo -e "\033[0;32m" "Welcome to the polkaHack CLI - Alpha Version 0.01" "\033[1;37m"

PS3="> Enter your favorite Chain: "

select character in Interlay 
do
    if [ $character = Interlay ]
    then
      echo ""
      echo -e "\033[0;34m""Interlay is one-stop-shop for Bitcoin DeFi""\033[1;37m" 
      echo "Start with Interlay here:"
      echo "https://docs.interlay.io/#/getting-started/interlay-101"
      echo ""
    fi
done


