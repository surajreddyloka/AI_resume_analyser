import motor.motor_asyncio
from app.core.config import settings

client = motor.motor_asyncio.AsyncIOMotorClient(settings.MONGO_URI)
# Parse database name from URI, default to 'airecruiter'
db_name = settings.MONGO_URI.split("/")[-1].split("?")[0]
if not db_name:
    db_name = "airecruiter"

db = client[db_name]

def get_db():
    return db
