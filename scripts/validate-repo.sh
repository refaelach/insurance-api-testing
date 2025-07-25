#!/bin/bash

echo "🔍 Validating Insurance API Security Testing Repository..."
echo "=================================================="

# Check for sensitive files
echo "📋 Checking for sensitive files..."
SENSITIVE_FILES=$(find . -name "*.env" -o -name "*.key" -o -name "*.pem" -o -name "*.p12" -o -name "*.pfx" -o -name "secrets*" -o -name "*secret*" | grep -v node_modules | grep -v .git)

if [ -n "$SENSITIVE_FILES" ]; then
    echo "❌ Found potentially sensitive files:"
    echo "$SENSITIVE_FILES"
    echo "Please review and add to .gitignore if needed"
else
    echo "✅ No sensitive files found"
fi

# Check for required files
echo ""
echo "📁 Checking required files..."
REQUIRED_FILES=("README.md" "LICENSE" ".gitignore" "docker-compose.yml" "docker-compose.prod.yml")

for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file exists"
    else
        echo "❌ $file missing"
    fi
done

# Check Docker setup
echo ""
echo "🐳 Checking Docker configuration..."
if [ -f "docker-compose.yml" ]; then
    echo "✅ docker-compose.yml exists"
    if grep -q "frontend\|backend\|nginx" docker-compose.yml; then
        echo "✅ Docker services configured"
    else
        echo "❌ Docker services not found in docker-compose.yml"
    fi
else
    echo "❌ docker-compose.yml missing"
fi

# Check project structure
echo ""
echo "📂 Checking project structure..."
DIRS=("frontend" "backend" "nginx" "scripts" "docs")

for dir in "${DIRS[@]}"; do
    if [ -d "$dir" ]; then
        echo "✅ $dir/ directory exists"
    else
        echo "❌ $dir/ directory missing"
    fi
done

# Check for node_modules (should be ignored)
echo ""
echo "📦 Checking for build artifacts..."
if [ -d "node_modules" ] || [ -d "frontend/node_modules" ] || [ -d "backend/node_modules" ]; then
    echo "⚠️  node_modules found - should be in .gitignore"
else
    echo "✅ No node_modules in repository"
fi

# Check README content
echo ""
echo "📖 Checking README.md..."
if [ -f "README.md" ]; then
    README_SIZE=$(wc -l < README.md)
    if [ "$README_SIZE" -gt 50 ]; then
        echo "✅ README.md has substantial content ($README_SIZE lines)"
    else
        echo "⚠️  README.md seems short ($README_SIZE lines)"
    fi
    
    if grep -q "docker-compose up" README.md; then
        echo "✅ README contains Docker instructions"
    else
        echo "❌ README missing Docker instructions"
    fi
else
    echo "❌ README.md missing"
fi

# Check .gitignore
echo ""
echo "🚫 Checking .gitignore..."
if [ -f ".gitignore" ]; then
    if grep -q "node_modules\|\.env\|\.DS_Store" .gitignore; then
        echo "✅ .gitignore contains common patterns"
    else
        echo "⚠️  .gitignore may be missing common patterns"
    fi
else
    echo "❌ .gitignore missing"
fi

echo ""
echo "🎯 Repository Validation Complete!"
echo "=================================================="
echo ""
echo "Next steps:"
echo "1. Review any warnings above"
echo "2. Create GitHub repository"
echo "3. Add remote: git remote add origin https://github.com/YOUR_USERNAME/insurance-api-testing.git"
echo "4. Push: git push -u origin main"
echo ""
echo "Happy testing! 🔒" 