#!/bin/zsh
rm ethereum/build/Kluest1155.abi
rm ethereum/build/Kluest1155.bin
solc --overwrite --abi --bin ethereum/src/Kluest1155.sol -o ethereum/build
mv ethereum/build/Kluest1155.abi ethereum/build/Kluest1155.abi.nop
mv ethereum/build/Kluest1155.bin ethereum/build/Kluest1155.bin.nop
rm ethereum/build/*.abi
rm ethereum/build/*.bin
mv ethereum/build/Kluest1155.abi.nop ethereum/build/Kluest1155.abi
mv ethereum/build/Kluest1155.bin.nop ethereum/build/Kluest1155.bin
cp ethereum/build/Kluest1155.abi public/
