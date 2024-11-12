// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MySmartWallet is Ownable {
  // withdraw token to owner
  function withdrawToOwner(address token, uint256 amount) external onlyOwner {
    IERC20(token).transfer(owner(), amount);
  }

  // get ERC20 balance
  function getTokenBalance(address token) public view returns (uint256) {
    return IERC20(token).balanceOf(address(this));
  }

  function getETHBalance() public view returns (uint256) {
    return address(this).balance;
  }

  receive() external payable {}
}