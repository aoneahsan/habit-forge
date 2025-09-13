# Blockers & Issues Tracker

## Active Blockers
*Currently no active blockers*

## Resolved Blockers

### Template for Blockers
```
### [BLOCKER-ID] Title
**Date Identified**: YYYY-MM-DD
**Severity**: Critical | High | Medium | Low
**Status**: Active | In Progress | Resolved
**Assigned To**: Team member
**Due Date**: YYYY-MM-DD

**Description**:
Detailed description of the blocker

**Impact**:
- What features/work is blocked
- Potential timeline impact

**Proposed Solution**:
Steps to resolve the blocker

**Resolution**:
How it was resolved (when completed)

**Lessons Learned**:
What we learned from this blocker
```

## Common Issues Reference

### Firebase Issues
- **Issue**: Firebase Functions Node version compatibility
- **Solution**: Use Node 22 for Functions, Node 24 for main app

### Capacitor Issues
- **Issue**: Platform-specific build errors
- **Solution**: Ensure native dependencies are properly configured

### Performance Issues
- **Issue**: Large bundle size
- **Solution**: Implement code splitting and lazy loading

### Testing Issues
- **Issue**: Test environment setup
- **Solution**: Use Vitest instead of Jest

## Risk Register

### High Risk Items
1. **D3.js Performance on Mobile**
   - Mitigation: Start with simple visualizations, optimize incrementally
   
2. **Firebase Costs at Scale**
   - Mitigation: Implement caching, optimize queries, monitor usage

3. **Offline Sync Conflicts**
   - Mitigation: Design conflict resolution strategy early

### Medium Risk Items
1. **Complex State Management**
   - Mitigation: Clear state architecture with Zustand

2. **Cross-Platform Compatibility**
   - Mitigation: Regular testing on all platforms

3. **User Adoption**
   - Mitigation: Focus on UX and onboarding

### Low Risk Items
1. **Documentation Maintenance**
   - Mitigation: Update docs with each feature

2. **Code Quality Drift**
   - Mitigation: Automated linting and testing

## Escalation Path
1. Try to resolve independently (1 hour)
2. Document in this file
3. Seek community/documentation help
4. Consider alternative approaches
5. Adjust timeline if necessary