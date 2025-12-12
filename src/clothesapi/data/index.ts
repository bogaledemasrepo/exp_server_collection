const DUMMYDATA=[
  {
    "product_id": "SKU789012",
    "name": "Men's Classic Cotton T-Shirt",
    "category": "Tops",
    "price": 24.99,
    "in_stock": true,
    "image_url": "https://images.unsplash.com/photo-1521572163472-b13c329cc6c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.0.3&q=80&w=400",
    "image_credit": "Photo by Alex Haigh on Unsplash",
    "variants": [
      {"color_name": "White", "size": "L", "stock_level": 50},
      {"color_name": "Black", "size": "M", "stock_level": 12}
    ]
  },
  {
    "product_id": "SKU345678",
    "name": "High-Waist Slim Fit Jeans",
    "category": "Bottoms",
    "price": 59.99,
    "in_stock": true,
    "image_url": "https://images.unsplash.com/photo-1556905553-ac562725e173?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.0.3&q=80&w=400",
    "image_credit": "Photo by Laura Chougnet on Unsplash",
    "variants": [
      {"color_name": "Dark Wash", "size": "28", "stock_level": 30},
      {"color_name": "Light Wash", "size": "26", "stock_level": 15}
    ]
  },
  {
    "product_id": "SKU901234",
    "name": "Women's Floral Summer Dress",
    "category": "Dresses",
    "price": 89.50,
    "in_stock": true,
    "image_url": "https://images.unsplash.com/photo-1598501168700-1c0c1b40283f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.0.3&q=80&w=400",
    "image_credit": "Photo by Tamara Bellis on Unsplash",
    "variants": [
      {"color_name": "Blue Floral", "size": "S", "stock_level": 5},
      {"color_name": "Pink Floral", "size": "M", "stock_level": 20}
    ]
  },
  {
    "product_id": "SKU567890",
    "name": "Unisex Waterproof Rain Jacket",
    "category": "Outerwear",
    "price": 120.00,
    "in_stock": true,
    "image_url": "https://images.unsplash.com/photo-1563299797-2a29774a38f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.0.3&q=80&w=400",
    "image_credit": "Photo by Daniel Lincoln on Unsplash",
    "variants": [
      {"color_name": "Yellow", "size": "L", "stock_level": 40},
      {"color_name": "Black", "size": "M", "stock_level": 10}
    ]
  },
  {
    "product_id": "SKU112233",
    "name": "Lightweight Performance Running Sneakers",
    "category": "Footwear",
    "price": 99.99,
    "in_stock": true,
    "image_url": "https://images.unsplash.com/photo-1552346154-21d32810cb99?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.0.3&q=80&w=400",
    "image_credit": "Photo by Jari Hytönen on Unsplash",
    "variants": [
      {"color_name": "Grey/Orange", "size": "9", "stock_level": 60},
      {"color_name": "Black/White", "size": "10", "stock_level": 25}
    ]
  },
  {
    "product_id": "SKU223344",
    "name": "Chunky Knit Winter Beanie",
    "category": "Accessories",
    "price": 19.99,
    "in_stock": true,
    "image_url": "https://images.unsplash.com/photo-1549480029-4e78d91c28c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.0.3&q=80&w=400",
    "image_credit": "Photo by Taylor Smith on Unsplash",
    "variants": [
      {"color_name": "Burgundy", "size": "OS", "stock_level": 80}
    ]
  },
  {
    "product_id": "SKU334455",
    "name": "Men's Slim Italian Leather Belt",
    "category": "Accessories",
    "price": 45.00,
    "in_stock": false,
    "image_url": "https://images.unsplash.com/photo-1605335133642-f8c7b89e3a6c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.0.3&q=80&w=400",
    "image_credit": "Photo by NordWood Themes on Unsplash",
    "variants": [
      {"color_name": "Brown", "size": "32", "stock_level": 0},
      {"color_name": "Black", "size": "34", "stock_level": 10}
    ]
  },
  {
    "product_id": "SKU445566",
    "name": "Striped Athletic Crew Socks (3-Pack)",
    "category": "Accessories",
    "price": 12.50,
    "in_stock": true,
    "image_url": "https://images.unsplash.com/photo-1588698947347-194098492040?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.0.3&q=80&w=400",
    "image_credit": "Photo by Siora Photography on Unsplash",
    "variants": [
      {"color_name": "Multi-Color", "size": "OS", "stock_level": 150}
    ]
  },
  {
    "product_id": "SKU556677",
    "name": "Classic Wool Blend Trench Coat",
    "category": "Outerwear",
    "price": 180.00,
    "in_stock": true,
    "image_url": "https://images.unsplash.com/photo-1551028308-013ac35a90d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.0.3&q=80&w=400",
    "image_credit": "Photo by R.D. Smith on Unsplash",
    "variants": [
      {"color_name": "Beige", "size": "S", "stock_level": 15},
      {"color_name": "Black", "size": "L", "stock_level": 5}
    ]
  },
  {
    "product_id": "SKU667788",
    "name": "Athletic Mesh Running Shorts",
    "category": "Bottoms",
    "price": 35.00,
    "in_stock": true,
    "image_url": "https://images.unsplash.com/photo-1596205763952-4414f529f7f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.0.3&q=80&w=400",
    "image_credit": "Photo by Marcus Loke on Unsplash",
    "variants": [
      {"color_name": "Navy Blue", "size": "M", "stock_level": 75}
    ]
  },
  {
    "product_id": "SKU778899",
    "name": "Luxury Paisley Silk Scarf",
    "category": "Accessories",
    "price": 65.00,
    "in_stock": true,
    "image_url": "https://images.unsplash.com/photo-1582234399252-87008803a6c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.0.3&q=80&w=400",
    "image_credit": "Photo by NordWood Themes on Unsplash",
    "variants": [
      {"color_name": "Red/Gold", "size": "OS", "stock_level": 30}
    ]
  },
  {
    "product_id": "SKU889900",
    "name": "Men's Button-Down Oxford Shirt",
    "category": "Tops",
    "price": 49.99,
    "in_stock": true,
    "image_url": "https://images.unsplash.com/photo-1603299380637-23b9d7e596d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.0.3&q=80&w=400",
    "image_credit": "Photo by R.D. Smith on Unsplash",
    "variants": [
      {"color_name": "Light Blue", "size": "L", "stock_level": 45}
    ]
  },
  {
    "product_id": "SKU990011",
    "name": "Women's Leather Crossbody Bag",
    "category": "Accessories",
    "price": 149.00,
    "in_stock": true,
    "image_url": "https://images.unsplash.com/photo-1594938637996-3c0765c5c00b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.0.3&q=80&w=400",
    "image_credit": "Photo by NordWood Themes on Unsplash",
    "variants": [
      {"color_name": "Tan", "size": "OS", "stock_level": 22}
    ]
  },
  {
    "product_id": "SKU001122",
    "name": "Classic Piqué Polo Shirt",
    "category": "Tops",
    "price": 39.99,
    "in_stock": true,
    "image_url": "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.0.3&q=80&w=400",
    "image_credit": "Photo by Alex Haigh on Unsplash",
    "variants": [
      {"color_name": "White", "size": "M", "stock_level": 90},
      {"color_name": "Green", "size": "XL", "stock_level": 15}
    ]
  },
  {
    "product_id": "SKU110099",
    "name": "A-Line Denim Mini Skirt",
    "category": "Bottoms",
    "price": 49.99,
    "in_stock": false,
    "image_url": "https://images.unsplash.com/photo-1601004886633-149020959f64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.0.3&q=80&w=400",
    "image_credit": "Photo by NordWood Themes on Unsplash",
    "variants": [
      {"color_name": "Medium Wash", "size": "XS", "stock_level": 0},
      {"color_name": "Dark Wash", "size": "L", "stock_level": 8}
    ]
  }
]