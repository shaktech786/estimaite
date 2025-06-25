import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

export async function POST(request: NextRequest) {
  try {
    const { story } = await request.json();

    if (!story || (!story.title && !story.description)) {
      return NextResponse.json(
        { error: 'Story title or description is required' },
        { status: 400 }
      );
    }

    // Prepare the story content for AI analysis
    const storyContent = `
Title: ${story.title || 'Untitled'}
Description: ${story.description || 'No description provided'}
Acceptance Criteria: ${story.acceptanceCriteria?.join('\n- ') || 'None provided'}
    `.trim();

    const { text } = await generateText({
      model: openai('gpt-3.5-turbo'),
      prompt: `
You are an expert Agile coach analyzing user stories for planning poker estimation.

Analyze this user story and provide a JSON response with the following structure:
{
  "complexity": "low" | "medium" | "high",
  "suggestedPoints": [1, 2, 3, 5, 8, 13],
  "reasoning": "Brief explanation of complexity factors",
  "tags": ["tag1", "tag2", "tag3"],
  "recommendations": ["recommendation1", "recommendation2"]
}

Consider these factors:
- Technical complexity and unknowns
- Dependencies on other systems/teams
- Amount of new code vs existing code changes
- Testing requirements
- UI/UX complexity
- Data migration or schema changes
- Integration complexity

Story to analyze:
${storyContent}

Provide only the JSON response, no additional text.
      `,
    });

    let analysis;
    try {
      analysis = JSON.parse(text);
    } catch {
      // Fallback analysis if AI response isn't valid JSON
      analysis = {
        complexity: 'medium',
        suggestedPoints: [3, 5, 8],
        reasoning: 'AI analysis temporarily unavailable, showing default estimation range.',
        tags: ['needs-analysis'],
        recommendations: ['Break down into smaller tasks if possible', 'Clarify requirements with stakeholders']
      };
    }

    return NextResponse.json({ analysis });

  } catch (error) {
    console.error('Error analyzing story:', error);

    // Return fallback analysis on error
    return NextResponse.json({
      analysis: {
        complexity: 'medium',
        suggestedPoints: [2, 3, 5, 8],
        reasoning: 'Unable to perform AI analysis at this time. Please estimate based on team experience.',
        tags: ['manual-estimation'],
        recommendations: ['Discuss complexity factors as a team', 'Consider breaking down if story seems large']
      }
    });
  }
}
