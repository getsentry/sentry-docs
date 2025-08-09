# .cursor/rules/ Scope Matrix

## Purpose
This document defines what content belongs in each `.cursor/rules/` file to prevent duplication and ensure clear boundaries.

## File Scope Definitions

| File | Primary Purpose | Content Type | What to Include | What to Exclude |
|------|----------------|-------------|-----------------|-----------------|
| **cursor.mdc** | Main navigation & overview | Entry point | Project overview, links to other files | Implementation details |
| **architecture.mdc** | System design & structure | Technical architecture | Repository structure, technology stack, deployment patterns | Code examples, business logic |
| **coding-guidelines.mdc** | Code quality & standards | Style standards | TypeScript patterns, formatting rules, quality checklists | Documentation structure, business rules |
| **common-patterns.mdc** | Reusable code patterns | Code examples | Standard implementations, utilities, shared components | Framework setup, business logic |
| **contribution-guidelines.mdc** | Contributing process | Process guidelines | Git workflow, PR process, review standards | Code patterns, architecture |
| **feature-development.mdc** | Development workflow | Process guidelines | PRFAQ → PRD → Implementation flow | Technical implementation |

## Content Type Guidelines

### ✅ Architecture Content
- Repository structure
- Technology decisions
- Deployment patterns
- Performance considerations

### ✅ Coding Standards Content  
- TypeScript conventions
- Formatting rules
- Error handling standards
- Testing patterns

### ✅ Common Patterns Content
- Reusable utilities
- Component patterns
- Standard implementations
- Shared code templates

### ❌ Avoid Duplication
- Don't repeat MDX documentation examples across files
- Don't duplicate technology explanations
- Don't copy-paste code patterns
- Don't repeat process explanations

## Cross-Reference Rules

### Link Instead of Duplicate
```markdown
# ✅ GOOD
For error handling patterns, see [Common Patterns](./common-patterns.mdc#error-handling)

# ❌ BAD  
[Copy-pasting the entire error handling section]
```

### Specific Line References
```markdown
# ✅ GOOD
See the database configuration pattern in [Architecture](./architecture.mdc:45-60)

# ❌ BAD
See database patterns somewhere in architecture file
```

## Content Hierarchy

1. **cursor.mdc** - Start here, links to everything
2. **architecture.mdc** - System design decisions  
3. **coding-guidelines.mdc** - How to write code
4. **common-patterns.mdc** - Reusable implementations
5. **feature-development.mdc** - How to build features
6. **contribution-guidelines.mdc** - How to contribute

## Quality Standards

### Each File Should:
- [ ] Serve a single, clear purpose
- [ ] Have no significant overlap with other files  
- [ ] Link to related content instead of duplicating
- [ ] Be actionable and specific to this project
- [ ] Include working examples where relevant

### Avoid:
- [ ] Generic programming advice
- [ ] Repeated documentation structure examples
- [ ] Copy-pasted content from other files
- [ ] Overwhelming walls of text 