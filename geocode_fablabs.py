import json
from geopy.geocoders import Nominatim
from geopy.extra.rate_limiter import RateLimiter

# Carregar os dados dos Fab Labs
with open("fab_labs_data.json", "r", encoding="utf-8") as f:
    fab_labs = json.load(f)

# Inicializar o geocodificador Nominatim
geolocator = Nominatim(user_agent="fablab_map_generator")
geocode = RateLimiter(geolocator.geocode, min_delay_seconds=1)

# Adicionar coordenadas aos dados
for lab in fab_labs:
    location_string = f"{lab['location']}, Brasil"
    try:
        location = geocode(location_string)
        if location:
            lab["latitude"] = location.latitude
            lab["longitude"] = location.longitude
            print(f"Coordenadas para {lab['name']}: {location.latitude}, {location.longitude}")
        else:
            lab["latitude"] = None
            lab["longitude"] = None
            print(f"Não foi possível encontrar coordenadas para {lab['name']}: {location_string}")
    except Exception as e:
        lab["latitude"] = None
        lab["longitude"] = None
        print(f"Erro ao geocodificar {lab['name']}: {e}")

# Salvar os dados atualizados
with open("fab_labs_data_with_coords.json", "w", encoding="utf-8") as f:
    json.dump(fab_labs, f, ensure_ascii=False, indent=4)


