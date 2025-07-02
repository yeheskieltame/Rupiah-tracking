# 🤝 Contributing to IDRT Transaction Analysis

Terima kasih atas interest untuk berkontribusi! Project ini adalah community-driven dan terbuka untuk semua yang ingin membantu mengembangkan tools analisis blockchain untuk ekosistem IDRT.

## 🌟 Ways to Contribute

### 🐛 **Bug Reports**
Found a bug? Help us fix it!
- Check [existing issues](https://github.com/yeheskieltame/Rupiah-tracking/issues) first
- Create detailed bug report dengan steps to reproduce
- Include error messages, screenshots, atau logs jika ada

### 💡 **Feature Requests**
Punya ide untuk fitur baru?
- Buka [GitHub Issues](https://github.com/yeheskieltame/Rupiah-tracking/issues)
- Label sebagai "enhancement"
- Jelaskan use case dan benefit untuk komunitas
- Diskusikan dengan maintainers sebelum development

### 🔧 **Code Contributions**

#### **Development Setup**
```bash
# 1. Fork repository
git clone https://github.com/YOUR-USERNAME/Rupiah-tracking.git
cd Rupiah-tracking

# 2. Install dependencies
npm install

# 3. Install Graph CLI
npm install -g @graphprotocol/graph-cli

# 4. Generate types
npm run codegen

# 5. Build
npm run build
```

#### **Development Workflow**
```bash
# 1. Create feature branch
git checkout -b feature/your-feature-name

# 2. Make changes
# Edit schema.graphql, src/idrt.ts, or documentation

# 3. Test your changes
npm run codegen
npm run build

# 4. Commit dengan descriptive message
git add .
git commit -m "feat: add wallet balance tracking feature"

# 5. Push dan create PR
git push origin feature/your-feature-name
```

#### **Code Style Guidelines**
- **GraphQL Schema**: Use clear entity names dan comprehensive comments
- **TypeScript**: Follow existing patterns dalam mapping handlers
- **Documentation**: Update README.md untuk new features
- **Comments**: Explain complex logic dalam Bahasa Indonesia atau English

### 📖 **Documentation**
Help improve docs:
- **README.md** - Main project documentation
- **QUERIES.md** - GraphQL query examples
- **DEPLOYMENT.md** - Deployment instructions
- Add tutorials untuk specific use cases

### 🧪 **Testing**
Help test the subgraph:
- Test dengan different wallet addresses
- Verify query results accuracy
- Test pada different networks (testnet/mainnet)
- Performance testing dengan large datasets

## 🎯 **Priority Areas**

### **High Priority**
- 🔍 **Advanced Analytics**: Volume analysis, whale detection
- 📊 **Dashboard Integration**: Frontend untuk visualisasi data
- ⚡ **Performance**: Query optimization, caching strategies
- 🔒 **Security**: Address validation, input sanitization

### **Medium Priority**
- 🌐 **Multi-network**: Support untuk Polygon, BSC networks
- 📱 **Mobile**: Responsive queries untuk mobile apps
- 🤖 **Automation**: Alert systems untuk large transfers
- 📈 **Historical**: Extended historical data analysis

### **Community Requests**
- 🏦 **Exchange Integration**: Track exchange flows
- 💱 **DEX Analysis**: Uniswap, PancakeSwap integration
- 📊 **Portfolio Tracking**: Multi-wallet portfolio analytics
- 🔔 **Notifications**: Real-time transfer alerts

## 📋 **Pull Request Process**

### **Before Submitting**
- [ ] Code builds successfully (`npm run build`)
- [ ] Documentation updated jika diperlukan
- [ ] Tested pada local environment
- [ ] Commits are descriptive dan atomic
- [ ] Branch is up-to-date dengan main

### **PR Template**
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement

## Testing
Describe testing done

## Screenshots (if applicable)
Add screenshots untuk visual changes

## Related Issues
Closes #(issue number)
```

### **Review Process**
1. **Automated Checks** - Build dan basic validation
2. **Code Review** - Maintainer review untuk quality
3. **Testing** - Functional testing pada staging
4. **Approval** - Final approval dan merge

## 🏆 **Recognition**

### **Contributors Wall**
Active contributors akan di-feature di README.md

### **Special Thanks**
- Major feature contributors get mentioned dalam release notes
- Regular contributors dapat special Discord role (jika ada community Discord)

## 💬 **Communication**

### **Questions?**
- **GitHub Issues** - Technical questions
- **GitHub Discussions** - General discussions
- **Email** - Private matters: [your-email@domain.com]

### **Response Time**
- **Issues**: Usually within 24-48 hours
- **PRs**: Review within 3-5 days
- **Questions**: Best effort, usually same day

## 🤗 **Community Guidelines**

### **Be Respectful**
- Inclusive language dalam comments dan discussions
- Respectful feedback dalam code reviews
- Help newcomers learn dan contribute

### **Quality First**
- Prioritize code quality over speed
- Comprehensive testing sebelum PR
- Clear documentation untuk new features

### **Collaboration**
- Discuss major changes dalam issues first
- Share knowledge dengan community
- Mentor new contributors

---

## 🙏 **Thank You!**

Every contribution, no matter how small, makes this project better for the entire Indonesian blockchain community. Whether you're fixing a typo, adding a feature, atau helping with testing - **terima kasih!**

**Happy Contributing! 🚀**
