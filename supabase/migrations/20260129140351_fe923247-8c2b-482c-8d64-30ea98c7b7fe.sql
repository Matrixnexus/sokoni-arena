-- Drop the existing RLS policy that requires friends
DROP POLICY IF EXISTS "Users can view stories from friends or own stories" ON public.fun_circle_stories;

-- Create new policy for public story visibility
CREATE POLICY "Anyone can view non-expired stories" 
ON public.fun_circle_stories 
FOR SELECT 
USING (expires_at > now());

-- Also update related policies for reactions and comments to allow on all visible stories
DROP POLICY IF EXISTS "Users can view reactions on visible stories" ON public.fun_circle_story_reactions;
CREATE POLICY "Users can view reactions on visible stories" 
ON public.fun_circle_story_reactions 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM fun_circle_stories s 
  WHERE s.id = fun_circle_story_reactions.story_id 
  AND s.expires_at > now()
));

DROP POLICY IF EXISTS "Users can add reactions to visible stories" ON public.fun_circle_story_reactions;
CREATE POLICY "Users can add reactions to visible stories" 
ON public.fun_circle_story_reactions 
FOR INSERT 
WITH CHECK ((auth.uid() = user_id) AND EXISTS (
  SELECT 1 FROM fun_circle_stories s 
  WHERE s.id = fun_circle_story_reactions.story_id 
  AND s.expires_at > now()
));

DROP POLICY IF EXISTS "Users can view comments on visible stories" ON public.fun_circle_comments;
CREATE POLICY "Users can view comments on visible stories" 
ON public.fun_circle_comments 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM fun_circle_stories s 
  WHERE s.id = fun_circle_comments.story_id 
  AND s.expires_at > now()
));

DROP POLICY IF EXISTS "Users can add comments to visible stories" ON public.fun_circle_comments;
CREATE POLICY "Users can add comments to visible stories" 
ON public.fun_circle_comments 
FOR INSERT 
WITH CHECK ((auth.uid() = user_id) AND EXISTS (
  SELECT 1 FROM fun_circle_stories s 
  WHERE s.id = fun_circle_comments.story_id 
  AND s.expires_at > now()
));

DROP POLICY IF EXISTS "Users can view mentions on visible stories" ON public.fun_circle_mentions;
CREATE POLICY "Users can view mentions on visible stories" 
ON public.fun_circle_mentions 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM fun_circle_stories s 
  WHERE s.id = fun_circle_mentions.story_id 
  AND s.expires_at > now()
) OR mentioned_user_id = auth.uid());