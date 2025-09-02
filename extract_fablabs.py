from bs4 import BeautifulSoup
import json

with open('/home/ubuntu/upload/rede.html', 'r') as f:
    html_content = f.read()

soup = BeautifulSoup(html_content, 'html.parser')

fab_labs_data = []

region_sections = soup.find_all('div', class_='region-section')

for region_section in region_sections:
    region_name = region_section.find('h3').get_text(strip=True).replace('Região ', '')
    lab_cards = region_section.find_all('div', class_='lab-card')
    
    for card in lab_cards:
        name = card.find('h4').get_text(strip=True)
        location = card.find('p').get_text(strip=True).replace('São Paulo, São Paulo', 'São Paulo, SP') # Standardize location
        description = card.find_all('p')[1].get_text(strip=True)
        link = card.find('a', class_='btn-outline')['href']
        
        fab_labs_data.append({
            'name': name,
            'location': location,
            'description': description,
            'link': link,
            'region': region_name
        })

with open('fab_labs_data.json', 'w', encoding='utf-8') as f:
    json.dump(fab_labs_data, f, ensure_ascii=False, indent=4)


