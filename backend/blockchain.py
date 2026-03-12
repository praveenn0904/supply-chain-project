from web3 import Web3
import json
import os

# Connect to Ganache
ganache_url = "http://127.0.0.1:7545"
web3 = Web3(Web3.HTTPProvider(ganache_url))

# Check connection
if not web3.is_connected():
    raise Exception("Ganache not connected")

# Use first Ganache account
account = web3.eth.accounts[0]

# Load ABI safely
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
abi_path = os.path.join(BASE_DIR, "abi.json")

with open(abi_path, "r") as f:
    abi = json.load(f)

# Contract address (YOUR DEPLOYED ADDRESS)
contract_address = "0xf8e81D47203A594245E36C48e151709F0C19fBe8"

contract = web3.eth.contract(
    address=contract_address,
    abi=abi
)

def store_on_blockchain(data):
    tx_hash = contract.functions.storeRecord(
        data["harvest_date"],
        int(data["perish_days"]),
        int(data["delay_days"]),
        data["perish_date"],
        data["delay_date"],
        data["risk"]
    ).transact({
        "from": account
    })

    web3.eth.wait_for_transaction_receipt(tx_hash)
