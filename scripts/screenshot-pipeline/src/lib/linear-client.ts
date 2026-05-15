/**
 * Linear API Client Abstraction
 *
 * Wraps the @linear/sdk to provide issue creation and deduplication
 * for the screenshot pipeline. Designed to be swappable with other
 * integrations (e.g., Linear MCP) in the future.
 */

import {LinearClient, Issue} from '@linear/sdk';
import {LinearIssueData} from './types';

export interface LinearClientConfig {
  apiKey: string;
  teamId: string;
  /** Whether to run in dry-run mode (log but don't create) */
  dryRun: boolean;
}

export interface LinearIssueResult {
  /** The Linear issue ID (e.g., "DOCS-1234") */
  issueId: string;
  /** The Linear issue URL */
  url: string;
  /** Whether this was a new issue or an existing duplicate */
  isNew: boolean;
  /** Title of the issue */
  title: string;
}

/**
 * High-level Linear client for the screenshot pipeline.
 */
export class ScreenshotLinearClient {
  private client: LinearClient;
  private config: LinearClientConfig;
  private labelCache: Map<string, string> = new Map();

  constructor(config: LinearClientConfig) {
    this.config = config;
    this.client = new LinearClient({apiKey: config.apiKey});
  }

  /**
   * Create a Linear issue for a screenshot/Arcade that needs manual attention.
   * Deduplicates: checks if an open issue with the same asset_path exists first.
   */
  async createIssue(data: LinearIssueData): Promise<LinearIssueResult> {
    if (this.config.dryRun) {
      console.log(`  [DRY RUN] Would create: ${data.title}`);
      return {
        issueId: 'DRY-RUN',
        url: 'https://linear.app/dry-run',
        isNew: true,
        title: data.title,
      };
    }

    // Check for existing open issue (deduplication)
    const existingIssue = await this.findExistingIssue(data.asset_path);
    if (existingIssue) {
      console.log(`  Skipping (duplicate): ${data.title} -> ${existingIssue.identifier}`);
      return {
        issueId: existingIssue.identifier,
        url: existingIssue.url,
        isNew: false,
        title: data.title,
      };
    }

    // Resolve label IDs
    const labelIds = await this.resolveLabelIds(data.labels);

    // Create the issue
    const issuePayload = await this.client.createIssue({
      teamId: this.config.teamId,
      title: data.title,
      description: data.description,
      labelIds,
    });

    const issue = await issuePayload.issue;
    if (!issue) {
      throw new Error(`Failed to create Linear issue: ${data.title}`);
    }

    console.log(`  Created: ${issue.identifier} - ${data.title}`);

    return {
      issueId: issue.identifier,
      url: issue.url,
      isNew: true,
      title: data.title,
    };
  }

  /**
   * Find an existing open issue that matches the given asset path.
   * Searches by title prefix to deduplicate.
   */
  private async findExistingIssue(assetPath: string): Promise<Issue | null> {
    // Extract the filename for searching (more reliable than full path)
    const filename = assetPath.split('/').pop() || assetPath;

    try {
      const issues = await this.client.issues({
        filter: {
          team: {id: {eq: this.config.teamId}},
          state: {type: {nin: ['completed', 'canceled']}},
          title: {contains: filename},
        },
        first: 5,
      });

      const nodes = issues.nodes;
      if (nodes.length > 0) {
        return nodes[0];
      }
    } catch (err) {
      console.warn(`Warning: Could not search for existing issues: ${err}`);
    }

    return null;
  }

  /**
   * Resolve label names to label IDs, creating labels if they don't exist.
   */
  private async resolveLabelIds(labelNames: string[]): Promise<string[]> {
    const ids: string[] = [];

    for (const name of labelNames) {
      if (this.labelCache.has(name)) {
        ids.push(this.labelCache.get(name)!);
        continue;
      }

      try {
        // Search for existing label
        const labels = await this.client.issueLabels({
          filter: {
            name: {eq: name},
            team: {id: {eq: this.config.teamId}},
          },
        });

        if (labels.nodes.length > 0) {
          const id = labels.nodes[0].id;
          this.labelCache.set(name, id);
          ids.push(id);
        } else if (!this.config.dryRun) {
          // Create the label
          const result = await this.client.createIssueLabel({
            name,
            teamId: this.config.teamId,
          });
          const label = await result.issueLabel;
          if (label) {
            this.labelCache.set(name, label.id);
            ids.push(label.id);
          }
        }
      } catch (err) {
        console.warn(`Warning: Could not resolve label "${name}": ${err}`);
      }
    }

    return ids;
  }
}
