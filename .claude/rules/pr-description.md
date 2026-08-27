# PR Description Format

When creating pull requests for sentry-docs, use the following format:

```markdown
## DESCRIBE YOUR PR

[Clear description of what the PR does and why]

[Bullet points of specific changes if helpful]

- Change 1
- Change 2

## IS YOUR CHANGE URGENT?

Help us prioritize incoming PRs by letting us know when the change needs to go live.
Select exactly one option. For deadlines, replace `YYYY-MM-DD` with the due date. You can update this information later by editing the PR description.

- [ ] Urgent deadline (GA date, etc.): YYYY-MM-DD
- [ ] Other deadline: YYYY-MM-DD
- [x] No deadline: Not urgent, can wait up to 1 week+

## SLA

- Teamwork makes the dream work, so please add a reviewer to your PRs.
- Please give the docs team up to 1 week to review your PR unless you've supplied a deadline.

Thanks in advance for your help!

## PRE-MERGE CHECKLIST

_Make sure you've checked the following before merging your changes:_

- [ ] Checked Vercel preview for correctness, including links
- [ ] PR was reviewed and approved by any necessary SMEs (subject matter experts)
- [ ] PR was reviewed and approved by a member of the [Sentry docs team](https://github.com/orgs/getsentry/teams/docs)
```

## Notes

- Keep the "IS YOUR CHANGE URGENT?" section in every PR description
- Default urgency to "No deadline" unless the user specifies otherwise
- Use `YYYY-MM-DD` for urgent and other deadline dates
- Include preview URLs when relevant (Vercel deploys preview URLs automatically)
- Keep the "DESCRIBE YOUR PR" section concise but informative
- Use bullet points for multiple discrete changes
