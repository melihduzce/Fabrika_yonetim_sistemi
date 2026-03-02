from pydantic import BaseModel

from pydantic import BaseModel

class OrderCreate(BaseModel):
    # Kendi projenize göre alanları doldurun
    item_name: str
    quantity: int
    price: float

class ProductCreate(BaseModel):
    name: str
    daily_capacity: int
    has_heat_treatment: bool
    base_cost: float


class OrderCreate(BaseModel):
    product_id: int
    quantity: int