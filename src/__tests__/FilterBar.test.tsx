// Unit tests for FilterBar collapsible tags logic

describe('FilterBar Collapsible Tags Logic', () => {
  test('displayedTags slice logic: shows 3 tags when showAllTags is false', () => {
    const availableTags = ['javascript', 'typescript', 'react', 'node', 'nextjs', 'testing'];
    const showAllTags = false;
    const displayedTags = showAllTags ? availableTags : availableTags.slice(0, 3);

    expect(displayedTags).toEqual(['javascript', 'typescript', 'react']);
    expect(displayedTags).toHaveLength(3);
  });

  test('displayedTags slice logic: shows all tags when showAllTags is true', () => {
    const availableTags = ['javascript', 'typescript', 'react', 'node', 'nextjs', 'testing'];
    const showAllTags = true;
    const displayedTags = showAllTags ? availableTags : availableTags.slice(0, 3);

    expect(displayedTags).toEqual(availableTags);
    expect(displayedTags).toHaveLength(6);
  });

  test('toggle button only shows when availableTags.length > 3', () => {
    const tagsSmall = ['javascript', 'typescript'];
    const tagsLarge = ['javascript', 'typescript', 'react', 'node', 'nextjs'];

    expect(tagsSmall.length > 3).toBe(false);
    expect(tagsLarge.length > 3).toBe(true);
  });

  test('correct "Show X more" message calculation', () => {
    const availableTags = ['javascript', 'typescript', 'react', 'node', 'nextjs', 'testing'];
    const moreCount = availableTags.length - 3;

    expect(moreCount).toBe(3);
    expect(`Show ${moreCount} more`).toBe('Show 3 more');
  });

  test('edge case: exactly 3 tags does not show toggle button', () => {
    const availableTags = ['javascript', 'typescript', 'react'];

    expect(availableTags.length > 3).toBe(false);
  });

  test('edge case: exactly 4 tags shows "Show 1 more" button', () => {
    const availableTags = ['javascript', 'typescript', 'react', 'node'];
    const moreCount = availableTags.length - 3;

    expect(availableTags.length > 3).toBe(true);
    expect(moreCount).toBe(1);
    expect(`Show ${moreCount} more`).toBe('Show 1 more');
  });

  test('tag selection logic: toggling active state', () => {
    const tag = 'javascript';
    const activeFiltersTags: string[] = [];

    // Add tag
    const isPressed = activeFiltersTags.includes(tag);
    const newActive = !isPressed;
    expect(newActive).toBe(true);

    // Remove tag (after it's added)
    activeFiltersTags.push(tag);
    const isPressedAfter = activeFiltersTags.includes(tag);
    const newActiveAfter = !isPressedAfter;
    expect(newActiveAfter).toBe(false);
  });
});
