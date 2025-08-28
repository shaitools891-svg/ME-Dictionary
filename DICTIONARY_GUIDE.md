# Dictionary Management Guide

This guide explains how to add new words to your dictionary app and manage custom word collections.

## 🎯 Quick Start

1. **Go to Settings** → Click "Manage Dictionaries"
2. **Import Options**:
   - Upload JSON files from your computer
   - Load dictionaries from web URLs
   - Add sample technology words for testing

## 📝 Creating Dictionary Files

### Method 1: Using AI (Recommended)

You can use AI tools like ChatGPT, Claude, or other language models to generate dictionary files:

**Prompt Example:**
```
Create a JSON dictionary file with 50 common medical terms. Include:
- English word with Bangla translation
- Part of speech (noun, verb, adjective, etc.)
- Definition in English
- 2-3 synonyms in English
- 1-2 antonyms in English
- 2 example sentences (one in English, one in Bangla)

Format as JSON with this structure:
{
  "english": {
    "word": {
      "id": "en-1",
      "word": "diagnosis",
      "language": "en",
      "translation": "রোগ নির্ণয়",
      "partOfSpeech": "noun",
      "definition": "identification of the nature of an illness",
      "synonyms": ["identification", "detection"],
      "antonyms": ["misdiagnosis"],
      "examples": [
        {
          "english": "The doctor made a quick diagnosis.",
          "bangla": "ডাক্তার দ্রুত রোগ নির্ণয় করলেন।"
        }
      ]
    }
  },
  "bangla": {
    // Same structure for Bangla words
  }
}
```

### Method 2: Manual Creation

Create a JSON file with this exact structure:

```json
{
  "english": {
    "your-word": {
      "id": "en-1",
      "word": "your-word",
      "language": "en",
      "translation": "আপনার শব্দ",
      "partOfSpeech": "noun",
      "definition": "Your definition here",
      "synonyms": ["synonym1", "synonym2"],
      "antonyms": ["antonym1"],
      "examples": [
        {
          "english": "Example sentence in English.",
          "bangla": "বাংলায় উদাহরণ বাক্য।"
        }
      ]
    }
  },
  "bangla": {
    "আপনার-শব্দ": {
      "id": "bn-1",
      "word": "আপনার-শব্দ",
      "language": "bn",
      "translation": "your-word",
      "partOfSpeech": "noun",
      "definition": "আপনার সংজ্ঞা এখানে",
      "synonyms": ["সমার্থক1", "সমার্থক2"],
      "antonyms": ["বিপরীত1"],
      "examples": [
        {
          "english": "Example sentence in English.",
          "bangla": "বাংলায় উদাহরণ বাক্য।"
        }
      ]
    }
  }
}
```

## 📂 File Organization

### Recommended File Naming:
- `medical-terms-dictionary.json`
- `business-words-dictionary.json`
- `technical-vocabulary-dictionary.json`
- `literature-terms-dictionary.json`

### File Size Guidelines:
- Keep individual files under 5MB
- Aim for 100-500 words per file for optimal performance
- Use categories to organize related terms

## 🌐 Hosting Dictionary Files

### Option 1: GitHub Gist (Free)
1. Create a new gist on GitHub
2. Paste your JSON content
3. Get the raw URL (click "Raw" button)
4. Use that URL in the app

### Option 2: Personal Website
Host your dictionary files on your own website or blog.

### Option 3: Dropbox/Google Drive
Upload JSON files and get shareable links.

## 🔧 Advanced Features

### Merging Dictionaries
The app automatically merges multiple dictionaries:
- Duplicate words are combined
- Synonyms and antonyms are merged
- Examples from multiple sources are combined

### Export Functionality
- Export your complete dictionary collection
- Backup your custom words
- Share dictionaries with others

### Validation
The app validates dictionary files to ensure:
- Correct JSON structure
- Required fields present
- Language consistency

## 📚 Dictionary Categories

### Popular Categories to Create:
1. **Medical Terms** - Healthcare vocabulary
2. **Business Words** - Corporate and finance terms
3. **Technical Terms** - Programming, engineering
4. **Literary Terms** - Writing and literature
5. **Legal Terms** - Law and justice vocabulary
6. **Scientific Terms** - Biology, chemistry, physics
7. **Sports Terms** - Athletics and games
8. **Music Terms** - Musical vocabulary
9. **Art Terms** - Visual arts vocabulary
10. **Geography** - Countries, cities, landmarks

## 🎨 Customization Examples

### Technology Dictionary Sample:
```json
{
  "english": {
    "algorithm": {
      "id": "en-tech-1",
      "word": "algorithm",
      "language": "en",
      "translation": "অ্যালগরিদম",
      "partOfSpeech": "noun",
      "definition": "a process or set of rules to be followed in calculations",
      "synonyms": ["procedure", "method", "process"],
      "antonyms": ["random"],
      "examples": [
        {
          "english": "The algorithm solves complex math problems.",
          "bangla": "অ্যালগরিদম জটিল গণিত সমস্যা সমাধান করে।"
        }
      ]
    }
  },
  "bangla": {
    "অ্যালগরিদম": {
      "id": "bn-tech-1",
      "word": "অ্যালগরিদম",
      "language": "bn",
      "translation": "algorithm",
      "partOfSpeech": "noun",
      "definition": "গণনায় অনুসরণ করার একটি প্রক্রিয়া বা নিয়মের সেট",
      "synonyms": ["পদ্ধতি", "প্রক্রিয়া"],
      "antonyms": ["এলোমেলো"],
      "examples": [
        {
          "english": "The algorithm solves complex math problems.",
          "bangla": "অ্যালগরিদম জটিল গণিত সমস্যা সমাধান করে।"
        }
      ]
    }
  }
}
```

## 🚀 Getting Started

1. **Create your first dictionary** using one of the methods above
2. **Test locally** by uploading the file in Settings
3. **Host the file** on a web server or GitHub Gist
4. **Import via URL** for permanent access
5. **Share with others** by exporting your collection

## 💡 Tips

- **Start small**: Begin with 20-50 words in your first dictionary
- **Use categories**: Group related terms together
- **Include examples**: Good examples help with learning
- **Regular updates**: Add new words periodically
- **Backup regularly**: Export your collection frequently

## 🔍 Troubleshooting

### Common Issues:
1. **Invalid JSON**: Use a JSON validator to check your file
2. **Missing fields**: Ensure all required fields are present
3. **Large files**: Split large dictionaries into smaller files
4. **Encoding issues**: Save files as UTF-8

### Getting Help:
- Check the in-app validation messages
- Review the sample dictionary structure
- Test with small files first

---

Happy dictionary building! 📚✨