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
        model = "llama-3.3-70b-versatile"

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
        print(f"LLM API Status: {response.status_code}")
        
        if response.status_code != 200:
            print(f"LLM API Error: {response.text}")
            response.raise_for_status()

        result = response.json()
        print(f"LLM API Result: {result}")

        if 'choices' not in result:
             print(f"Error: 'choices' missing from response: {result}")
             return {"suggested_category": "general", "suggested_priority": "medium"}

        content = result['choices'][0]['message']['content'].strip()
        print(f"LLM Content: {content}")
        
        # Strip potential markdown formatting
        if content.startswith("```"):
            content = content.split("```")[1]
            if content.startswith("json"):
                content = content[4:]
            content = content.strip("`").strip()

        # Parse JSON from content
        try:
            classification = json.loads(content)
        except json.JSONDecodeError:
            print(f"Failed to parse JSON from content: {content}")
            return {"suggested_category": "general", "suggested_priority": "medium"}
        
        # Validate output
        valid_categories = ['billing', 'technical', 'account', 'general']
        valid_priorities = ['low', 'medium', 'high', 'critical']
        
        cat = classification.get("suggested_category", "").lower()
        prio = classification.get("suggested_priority", "").lower()

        if cat not in valid_categories:
            cat = "general"
        if prio not in valid_priorities:
            prio = "medium"
            
        return {
            "suggested_category": cat,
            "suggested_priority": prio
        }

    except Exception as e:
        print(f"LLM Classification failed: {e}")
        import traceback
        traceback.print_exc()
        return {"suggested_category": "general", "suggested_priority": "medium"}
