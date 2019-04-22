---
title: Clubhouse
sidebar_order: 2
---

Create a more efficient workflow by linking your Sentry Issues with your Clubhouse Stories. Errors, features, and anything else you track in Clubhouse can now live side by side. The new Clubhouse integration has feature parity with the Clubhouse plugin. If you're choosing between the two, we recommend installing the Clubhouse integration.

{% include components/alert.html
  title="Note"
  content="This integration will **not** work on-premise."
  level="warning"
%}

# Installation

1. In Sentry, navigate to Organization Settings > **Integrations**.

    [{% asset clubhouse/clubhouse_integration.png alt="Sentry's integrations page with Clubhouse at the top." %}]({% asset clubhouse/clubhouse_integration.png @path %})

2. Find the Clubhouse Integration and click **Install**.
3.  In the resulting modal, approve the permissions by clicking **Install**.

    [{% asset clubhouse/clubhouse_modal.png alt="Sentry's modal to install Clubhouse and approve permissions." %}]({% asset clubhouse/clubhouse_modal.png @path %})

4. Your Clubhouse Integration is ready to use!

# Configuration

## Link an Issue

When linking an issue, you'll need either an existing Clubhouse Story or you'll need to create a Clubhouse Story.

### Route 1: Clubhouse Story Exists

You can link a Sentry Issue to an existing Clubhouse Story.

1. In Sentry, navigate to the specific **Issue** you want to link.
2. Click on **Link Clubhouse Issue** under **Linked Issues**.

    [{% asset clubhouse/clubhouse_link_issue.png alt="Sentry's sidebar button for linking issues." %}]({% asset clubhouse/clubhouse_link_issue.png @path %})

3. Select the **Issue** you want to link.

    [{% asset clubhouse/clubhouse_choose_issue.png alt="Sentry's modal to link an issue to an existing Story." %}]({% asset clubhouse/clubhouse_choose_issue.png @path %})
    
4. Click **Save Changes** to submit the form.

5. Click on the **Clubhouse Story** under **Linked Issues**. This will automatically take you to Clubhouse.

    [{% asset clubhouse/clubhouse_story_in_linked_issues_82.png alt="Sentry's sidebar button illustrating that an issue is linked." %}]({% asset clubhouse/clubhouse_story_in_linked_issues_82.png @path %})

6. In Clubhouse, you can review your Clubhouse Story and the linked external ticket to Sentry.

    [{% asset clubhouse/clubhouse_story_with_issue_linked_82.png alt="Clubhouse web interface illustrating the linked Sentry issue." %}]({% asset clubhouse/clubhouse_story_with_issue_linked_82.png @path %})

### Route 2: Create a Clubhouse Story Based on a Sentry Issue

You can take a Sentry Issue, create a Clubhouse Story, and link the two.

1. In Sentry, navigate to the specific Issue you want to link.
2. Click on **Link Clubhouse Issue** under **Linked Issues**. ****

[](https://www.notion.so/3da72f9a66064aa89609db7b2b31951b#8647f7eb621d4cb28c79a70447aa2ff0)

3. Add information to the created Clubhouse Story. **[MIMI: This screenshot is out of date]**

A) Title of Story (auto-filled from the Sentry Issue, but also editable)

B) Summary of Story (auto-filled from Sentry Issue, but also editable)

[](https://www.notion.so/3da72f9a66064aa89609db7b2b31951b#7d965204351348de97b74e62e4173db6)

4. Click **Save Changes** to submit the form.

5. Click on the **Clubhouse Story** under **Linked Issues**. This will automatically take you to Clubhouse.

[](https://www.notion.so/3da72f9a66064aa89609db7b2b31951b#4b5c6ace22104f069ec87478c1008b62)

6. In Clubhouse, you can review your Clubhouse Story and the linked external ticket to Sentry. **[MIMI: check if this screenshot is correct]**

[](https://www.notion.so/3da72f9a66064aa89609db7b2b31951b#92571d95b8b34c00ba537ac428e83a55)