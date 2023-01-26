
1. Go to [Astar network documentation](https://docs.astar.network/).
2. Go to the [swanky suite documentation](https://docs.astar.network/docs/wasm/sc-dev/swanky).
3. Go to the latest [Realease](https://github.com/AstarNetwork/swanky-cli/releases/tag/v1.0.7)
4. Copy the address link. [Picture](https://i.ibb.co/pzksCr8/image.png)
5. Go to your home folder `cd ~`
6. Download it. The command is the following `wget https://github.com/AstarNetwork/swanky-cli/releases/download/v1.0.7/swanky-v1.0.7-0b6ed86-linux-x64.tar.gz` . Be aware I run ubunutu. The windows guide should look diffrent.
7. Type `ls -la` and look if its in your folder. [Picture](https://i.ibb.co/yV9gXpV/image.png)
8. If you have `tldr`, then run `tldr tar` to get a quick overview to unpack it.
9. Run `tar xvf swanky-v1.0.7-0b6ed86-linux-x64.tar.gz`
10. Nice, now you unpacked it. There is now a folder in your home directory. Its called swanky. Type `cd swanky`. Which ports your in the folder swanky.
11. Type `ls`, which shows you what is inside.
12. Type `cat README.md` or if you want to be on of the cool kids, run `bat README.md` or `glow README.md --pager` . Type `q` for exit the pager.
13. Now we do exactly what does it says. I mean exactly. Always trust the README.md .
14. First run `npm install -g @astar-network/swanky-cli` . If you dont have npm, google it, quickly.
15. Type `swanky --version` . I got this as result. [Image](https://i.ibb.co/Zch5xHM/image.png). You get something diffrent, but if get something, thats amazing.
16. Type `swanky --help`.
17. Type `swanky account create Frank`
18. Type `swanky account list`, ok that doesnt work [Picture](https://i.ibb.co/VSRXP5T/image.png)
19. Type `swanky help`
20. Type `swanky init`, ok that doesnt work [Picture](https://i.ibb.co/b2L9VvX/image.png)
21. Type `swanky init --help`, ok that doesnt work either 😹 [Picture](https://i.ibb.co/FJp0VW2/image.png)
22. Ok it seems it need a swanky config.
23. Type `cp ../Polkahack/swanky.config.json .` 
24. and try again `swanky init flipper`
25. Ok that doesnt work. Lets copy the binaries in the current folder.
26. Type `whereis swanky`, in my case its [here](https://i.ibb.co/gVF8D0X/image.png)
27. Type `whereis swanky | clip.exe` to copy the path. Or just copy with your mouse.
28. Type `cp /home/frank/.nvm/versions/node/v18.13.0/bin/swanky .` 
29. Ahh screw it. ok global doesnt work. lets try to do it locally in the current folder.
30. Type `rm -r swanky swanky.config.js` to get rid of produced files.
31. Type `npm install @astar-network/swanky-cli` 
32. Type `swanky init frankOrWhater`
33. Screw it, i guess it access the global thingy again
34. Ok diffrent idea. First geht rid of everything. Type `rm -r node_modules/ package-lock.json package.json`
35. copy the binary in this folder `cp -r ~/swanky/bin .`
36. ok doesnt work either, because depencies are missing.
37. ok get rid of everything again `rm -r bin/`
38. type `~/swanky/bin/swanky init .` 
39. BEEE HAAAPPYYY xD
40. choose `ink`, then `flipper`, yes name flipper, name is FrankBevr, my mail is frank_dierolf@web.de, yes i want a swanky node aaand it starts.
41. wait.
42. finished [picture](https://i.ibb.co/2jYgrFH/image.png)
43. type `cat ~/swanky/README.md`
44. type command 1, `~/swanky/bin/swanky account create Olaf` , mhh doesnt work
45. First start a node? `~/swanky/bin/node`, nahh thats just node
46. type `cat package.json`, look unter script and ther is a script that called run-node
47. type `yarn run-node` ohh sweet, that works
48. Ahh ok type `swanky contract compile flipper`, that works. [Picture](https://i.ibb.co/cwxm149/image.png)
49. lets try deploy `swanky contract deploy flipper`, doesnt work, i guess first node.
50. `yarn run-node` than split terminal and cd in the folder and try again. [Looks like this.](https://i.ibb.co/K6Tvchx/image.png)
51. ok i miss some flags [Picture](https://i.ibb.co/TmPjnw1/image.png)
52. lets try to create an account again `swanky account create Frank`, ok without Frank `swanky account create`
53. Yes this is a dev account, menomic enter, alias enter, 
54. oh man, ok type `cat swanky.config.js`
55. ok there is alice and bob as an account
56. Type `swanky contract deploy flipper --account Alice --gas 1000000000`
57. mhh [picture](https://i.ibb.co/WF6GKKv/image.png)
58. install swanky under sudo. `sudo npm install -g @astar-network/swanky-cli`
59. Type `sudo swanky`
60. Type `sudo swanky contract compile flipper`
61. damned nothing happens.
62. type `sudo /home/frank/swanky/bin/swanky contract deploy flipper --acount alice --gas 10000000000000`
63. Getting wasm error again
64. `yarn postinstall` nah, try `yarn test` nahhh ._.
65. break, I am annoyed. Have feeling it somehow the node itself. becuase [Picture](https://i.ibb.co/vh82HjS/image.png)


