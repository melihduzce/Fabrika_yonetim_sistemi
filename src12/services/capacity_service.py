def calculate_capacity_utilization(db):
    monthly_capacity = 120000

    open_orders = sum(
        order.quantity for order in db.query(Order).filter(Order.status == "OPEN")
    )

    utilization = (open_orders / monthly_capacity) * 100

    return {
        "monthly_capacity": monthly_capacity,
        "open_orders": open_orders,
        "utilization": round(utilization, 2)
    }