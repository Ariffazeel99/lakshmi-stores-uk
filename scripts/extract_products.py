import os
import json
import time
import requests

BASE_URL = "https://www.lakshmistores.com"
OUTPUT_DIR = "./lakshmi_store_data"
IMAGES_DIR = os.path.join(OUTPUT_DIR, "images")

os.makedirs(IMAGES_DIR, exist_ok=True)

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
}

all_products = []
page = 1
limit = 250  # Maximum products allowed per page by Shopify

print(f"Starting export from {BASE_URL}...")

while True:
    url = f"{BASE_URL}/products.json?limit={limit}&page={page}"
    try:
        response = requests.get(url, headers=headers, timeout=15)
    except Exception as err:
        print(f"Network error on page {page}: {err}")
        break

    if response.status_code != 200:
        print(f"Failed to fetch page {page}. Status: {response.status_code}")
        break

    data = response.json()
    products = data.get("products", [])

    if not products:
        print("No more products found.")
        break

    print(f"Processing Page {page} ({len(products)} products)...")

    for item in products:
        # Extract variants (weights, packs, prices)
        variants_data = []
        for v in item.get("variants", []):
            variants_data.append({
                "id": v.get("id"),
                "title": v.get("title"),  # e.g., "1 kg", "500 g"
                "price": float(v.get("price", 0)),
                "compare_at_price": float(v.get("compare_at_price")) if v.get("compare_at_price") else None,
                "sku": v.get("sku"),
                "available": v.get("available")
            })

        # Gather image URLs
        images_list = [img.get("src") for img in item.get("images", []) if img.get("src")]
        main_image_url = images_list[0] if images_list else None
        local_image_filename = None

        # Download primary product image locally
        if main_image_url:
            try:
                clean_url = main_image_url.split("?")[0]
                ext = clean_url.split(".")[-1] if "." in clean_url else "jpg"
                if ext.lower() not in ["jpg", "jpeg", "png", "webp"]:
                    ext = "jpg"
                handle = item.get("handle") or str(item.get("id"))
                local_image_filename = f"{handle}.{ext}"
                local_path = os.path.join(IMAGES_DIR, local_image_filename)

                if not os.path.exists(local_path):
                    img_data = requests.get(main_image_url, headers=headers, timeout=10).content
                    with open(local_path, "wb") as f:
                        f.write(img_data)
            except Exception as e:
                print(f"Could not download image for {item.get('title')}: {e}")

        # Structure normalized product object
        product_record = {
            "id": item.get("id"),
            "title": item.get("title"),
            "handle": item.get("handle"),
            "product_type": item.get("product_type"),
            "vendor": item.get("vendor"),
            "tags": item.get("tags"),
            "description": item.get("body_html"),
            "price": variants_data[0]["price"] if variants_data else 0,
            "compare_at_price": variants_data[0]["compare_at_price"] if variants_data else None,
            "variants": variants_data,
            "primary_image_url": main_image_url,
            "local_image_path": f"/images/{local_image_filename}" if local_image_filename else None,
            "all_images": images_list
        }

        all_products.append(product_record)

    page += 1
    time.sleep(1)  # Polite crawl delay

# Save final structured JSON file
json_output_path = os.path.join(OUTPUT_DIR, "products.json")
with open(json_output_path, "w", encoding="utf-8") as f:
    json.dump(all_products, f, indent=2, ensure_ascii=False)

print(f"\nDone! Extracted {len(all_products)} products.")
print(f"- Data: {json_output_path}")
print(f"- Images: {IMAGES_DIR}")

