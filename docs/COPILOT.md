# Optional Microsoft Copilot use

The app itself is AI-free. Copilot is neither required nor integrated, and it must not run grading, produce a scored answer, issue queries automatically, or receive app state.

If organizational policy permits the user's approved work Copilot experience, it can optionally explain a public documentation excerpt, compare two **symbolic** query structures, or suggest questions to ask about a field's role. Default prompts contain only course constants and public syntax. No real identifiers, logs, screenshots, tenant URLs, results, internal notes, or copied production query may be sent as part of this course.

Example prompt, typed separately inside the approved work experience:

> Explain why `metadata.event_type = "USER_LOGIN" AND (principal.user.userid = "__USER__" OR target.user.userid = "__USER__")` differs from the same expression without parentheses. Use only symbolic values. Link to the official Google SecOps Search syntax documentation. Do not suggest SOAR or rule deployment.

Treat output as an untrusted suggestion. Verify syntax in official Google docs and the authorized manual Search editor. An AI's confidence is not a compiler or investigation result. Assisted work may still use the same rubric; no score proves independent recall.

Microsoft documents enterprise protection for eligible organizational experiences, but the user's edition, identity, tenant settings, and policy are unknown. Web-grounded search has a separate data-handling path. Approval for Copilot at work is not blanket approval to disclose SIEM data. No paid license, API, or Copilot Studio agent is required or assumed. [Microsoft enterprise protection](https://learn.microsoft.com/en-us/microsoft-365/copilot/enterprise-data-protection), [privacy and web-query protections](https://learn.microsoft.com/en-us/copilot/privacy-and-protections).
