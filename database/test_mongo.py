"""
MongoDB Connection Test Utility for DineIQ Analytics
"""
import os
import sys
from dotenv import load_dotenv
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, OperationFailure

def main():
    load_dotenv()

    uri = os.getenv("MONGODB_URI", "")
    db_name = os.getenv("MONGODB_DATABASE", "dineiq_analytics")

    print("=" * 60)
    print("DineIQ Analytics - MongoDB Atlas Connectivity Test")
    print("=" * 60)

    if not uri:
        print("[ERROR] MONGODB_URI not found in .env file.")
        sys.exit(1)

    if "<db_password>" in uri:
        print("[WARNING] The '<db_password>' placeholder is still in your MONGODB_URI.")
        print("Please open the .env file and replace '<db_password>' with your actual password:")
        print(f"File: {os.path.abspath('.env')}")
        sys.exit(0)

    # Mask password in console output
    masked_uri = uri.split("@")[-1] if "@" in uri else uri
    print(f"Connecting to cluster: ...@{masked_uri}")

    try:
        client = MongoClient(uri, serverSelectionTimeoutMS=5000)
        # The ping command is cheap and confirms cluster connectivity
        client.admin.command("ping")
        print(f"[SUCCESS] Successfully connected to MongoDB Atlas!")
        print(f"Target Database: {db_name}")
        print(f"Server Info: {client.server_info().get('version', 'N/A')}")
    except OperationFailure as e:
        print(f"[AUTH ERROR] Authentication failed. Please check your username and password.")
        print(f"Details: {e}")
    except ConnectionFailure as e:
        print(f"[CONNECTION ERROR] Could not connect to cluster. Check network/IP whitelist in Atlas.")
        print(f"Details: {e}")
    except Exception as e:
        print(f"[ERROR] Unexpected error: {e}")


if __name__ == "__main__":
    main()

