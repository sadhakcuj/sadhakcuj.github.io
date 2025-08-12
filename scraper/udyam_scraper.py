#!/usr/bin/env python3
"""
Udyam Registration Portal Web Scraper
Extracts form fields, validation rules, and UI structure from the Udyam portal
"""

import requests
from bs4 import BeautifulSoup
import json
import re
import time
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class UdyamScraper:
    def __init__(self):
        self.base_url = "https://udyamregistration.gov.in/UdyamRegistration.aspx"
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
    
    def scrape_form_structure(self):
        """Scrape the main form structure"""
        try:
            logger.info("Starting form structure scraping...")
            
            # Get the page content
            response = self.session.get(self.base_url)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Extract form fields
            form_data = self.extract_form_fields(soup)
            
            # Extract validation rules
            validation_rules = self.extract_validation_rules(soup)
            
            # Extract UI components
            ui_components = self.extract_ui_components(soup)
            
            # Combine all data
            scraped_data = {
                "form_structure": form_data,
                "validation_rules": validation_rules,
                "ui_components": ui_components,
                "scraping_timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
            }
            
            # Save to JSON file
            with open('scraped_form_data.json', 'w', encoding='utf-8') as f:
                json.dump(scraped_data, f, indent=2, ensure_ascii=False)
            
            logger.info("Form structure scraping completed successfully")
            return scraped_data
            
        except Exception as e:
            logger.error(f"Error during form scraping: {e}")
            return None
    
    def extract_form_fields(self, soup):
        """Extract all form input fields"""
        form_fields = []
        
        try:
            # Find all input elements
            inputs = soup.find_all("input")
            
            for input_elem in inputs:
                field_info = {
                    "type": input_elem.get("type", "text"),
                    "id": input_elem.get("id"),
                    "name": input_elem.get("name"),
                    "placeholder": input_elem.get("placeholder"),
                    "required": input_elem.get("required") is not None,
                    "maxlength": input_elem.get("maxlength"),
                    "pattern": input_elem.get("pattern"),
                    "class": input_elem.get("class")
                }
                
                # Find associated label
                label = self.find_associated_label(input_elem)
                if label:
                    field_info["label"] = label
                
                form_fields.append(field_info)
            
            # Find all select elements
            selects = soup.find_all("select")
            for select_elem in selects:
                field_info = {
                    "type": "select",
                    "id": select_elem.get("id"),
                    "name": select_elem.get("name"),
                    "required": select_elem.get("required") is not None,
                    "class": select_elem.get("class")
                }
                
                # Find associated label
                label = self.find_associated_label(select_elem)
                if label:
                    field_info["label"] = label
                
                # Extract options
                options = []
                for option in select_elem.find_all("option"):
                    options.append({
                        "value": option.get("value"),
                        "text": option.text
                    })
                field_info["options"] = options
                
                form_fields.append(field_info)
                
        except Exception as e:
            logger.error(f"Error extracting form fields: {e}")
        
        return form_fields
    
    def find_associated_label(self, element):
        """Find label associated with form element"""
        try:
            # Try to find label by for attribute
            element_id = element.get("id")
            if element_id:
                label = element.find_previous("label", attrs={"for": element_id})
                if label:
                    return label.text.strip()
            
            # Try to find parent label
            parent_label = element.find_parent("label")
            if parent_label:
                return parent_label.text.strip()
                
        except Exception:
            pass
        
        return None
    
    def extract_validation_rules(self, soup):
        """Extract validation rules from the form"""
        validation_rules = {
            "pan_format": "[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}",
            "aadhaar_format": "[0-9]{12}",
            "mobile_format": "[0-9]{10}",
            "email_format": "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
            "pincode_format": "[0-9]{6}"
        }
        
        try:
            # Look for validation scripts
            scripts = soup.find_all("script")
            for script in scripts:
                script_content = script.string
                if script_content:
                    # Extract validation patterns
                    patterns = re.findall(r'pattern.*?["\']([^"\']+)["\']', script_content)
                    for pattern in patterns:
                        if "pan" in pattern.lower():
                            validation_rules["pan_format"] = pattern
                        elif "aadhaar" in pattern.lower():
                            validation_rules["aadhaar_format"] = pattern
                            
        except Exception as e:
            logger.error(f"Error extracting validation rules: {e}")
        
        return validation_rules
    
    def extract_ui_components(self, soup):
        """Extract UI component information"""
        ui_components = {
            "buttons": [],
            "progress_indicators": [],
            "error_messages": [],
            "success_messages": []
        }
        
        try:
            # Extract buttons
            buttons = soup.find_all("button")
            for button in buttons:
                button_info = {
                    "text": button.text.strip(),
                    "id": button.get("id"),
                    "class": button.get("class"),
                    "type": button.get("type")
                }
                ui_components["buttons"].append(button_info)
            
            # Extract input buttons
            input_buttons = soup.find_all("input", attrs={"type": ["button", "submit"]})
            for button in input_buttons:
                button_info = {
                    "text": button.get("value", ""),
                    "id": button.get("id"),
                    "class": button.get("class"),
                    "type": button.get("type")
                }
                ui_components["buttons"].append(button_info)
                
        except Exception as e:
            logger.error(f"Error extracting UI components: {e}")
        
        return ui_components

def main():
    """Main function to run the scraper"""
    scraper = UdyamScraper()
    
    print("Starting Udyam Registration Portal Scraping...")
    print("=" * 50)
    
    # Scrape form structure
    form_data = scraper.scrape_form_structure()
    
    if form_data:
        print("✅ Form structure scraped successfully!")
        print(f"📊 Found {len(form_data['form_structure'])} form fields")
        print(f"🔒 Found {len(form_data['validation_rules'])} validation rules")
        print(f"🎨 Found {len(form_data['ui_components']['buttons'])} UI components")
        print("\n📁 Data saved to 'scraped_form_data.json'")
    else:
        print("❌ Scraping failed!")
    
    print("\n" + "=" * 50)
    print("Scraping completed!")

if __name__ == "__main__":
    main() 