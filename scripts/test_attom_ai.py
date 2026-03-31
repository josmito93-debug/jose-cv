import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load credentials from .env.local
load_dotenv('.env.local')

def test_attom_ai():
    api_key = os.getenv('GEMINI_API_KEY')
    if not api_key:
        print("❌ Error: No GEMINI_API_KEY found in .env.local")
        return

    print(f"📡 Testing Gemini with key: {api_key[:10]}...")
    
    genai.configure(api_key=api_key)
    
    # Use the same model as the app
    model = genai.GenerativeModel('gemini-2.0-flash')
    
    prompt = """
    Eres Attom, una IA de Universa Agency.
    Responde estrictamente en formato JSON:
    {
      "response": "Hola, soy Attom. Prueba exitosa.",
      "extractedInfo": [
        { "field": "testStatus", "value": "Operational" }
      ]
    }
    """
    
    try:
        print("🤖 Sending request to Gemini...")
        response = model.generate_content(prompt)
        print("\n✨ --- GEMINI RESPONSE ---")
        print(response.text)
        print("--- END RESPONSE ---\n")
        
        if "testStatus" in response.text:
            print("✅ SUCCESS: AI is responding and following JSON format.")
        else:
            print("⚠️ WARNING: AI responded but format might be loose.")
            
    except Exception as e:
        print(f"❌ CRITICAL ERROR: {str(e)}")

if __name__ == "__main__":
    test_attom_ai()
