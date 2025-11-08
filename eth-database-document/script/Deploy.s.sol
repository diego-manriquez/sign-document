// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/DocumentRegistry.sol";

contract DeployScript is Script {
    function run() external {

        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        // === Get the deployer's address ===
        address deployer = vm.addr(deployerPrivateKey);
        console.log("Deploying with account:", deployer);

        // === Start broadcasting transactions ===
        vm.startBroadcast(deployerPrivateKey);

        // === Deploy the contract ===
        DocumentRegistry documentRegistry = new DocumentRegistry();
        console.log("DocumentRegistry deployed at:", address(documentRegistry));

        // === Stop broadcasting ===
        vm.stopBroadcast();
    }
}
