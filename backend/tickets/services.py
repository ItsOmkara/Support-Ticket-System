import os
import requests
import json
from django.conf import settings

def classify_ticket(description):
    """
    Classifies a ticket description into category and priority using an LLM.
    """
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        return {"suggested_category": "general", "suggested_priority": "medium"}

    # Determine endpoint and model based on key prefix
    base_url = "https://api.openai.com/v1/chat/completions"
    model = "gpt-3.5-turbo"
    
    if api_key.startswith("gsk_"):
        base_url = "https://api.groq.com/openai/v1/chat/completions"
        model = "llama3-8b-8192"

    prompt = f"""
    Analyze the following support ticket description and classify it.
    Return ONLY a JSON object with keys "suggested_category" and "suggested_priority".
    
    Category must be one of: billing, technical, account, general.
    Priority must be one of: low, medium, high, critical.

    Description: {description}
    """

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }

    data = {
        "model": model,
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0
    }

    try:
        response = requests.post(
            base_url,
            headers=headers,
            json=data,
            timeout=10
        )
        response.raise_for_status()
        result = response.json()
        content = result['choices'][0]['message']['content'].strip()
        
        # Parse JSON from content
        classification = json.loads(content)
        
        # Validate output
        valid_categories = ['billing', 'technical', 'account', 'general']
        valid_priorities = ['low', 'medium', 'high', 'critical']
        
        if classification.get("suggested_category") not in valid_categories:
            classification["suggested_category"] = "general"
        if classification.get("suggested_priority") not in valid_priorities:
            classification["suggested_priority"] = "medium"
            
        return classification

    except Exception as e:
        print(f"LLM Classification failed: {e}")
        return {"suggested_category": "general", "suggested_priority": "medium"}
