CREATE OR REPLACE FUNCTION public.execute_readonly_sql(q text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result jsonb;
BEGIN
  IF q IS NULL OR btrim(q) = '' THEN
    RAISE EXCEPTION 'Query must not be empty';
  END IF;

  IF q ~* '^\s*(select|with)\b' IS NOT TRUE THEN
    RAISE EXCEPTION 'Only SELECT/WITH queries are allowed';
  END IF;

  IF q ~* '\b(insert|update|delete|drop|alter|create|truncate|grant|revoke|execute|call|copy|do)\b' THEN
    RAISE EXCEPTION 'Unsafe SQL keyword detected';
  END IF;

  IF q ~ ';' OR q ~ '--' OR q ~ '/\*' THEN
    RAISE EXCEPTION 'Semicolons/comments are not allowed';
  END IF;

  EXECUTE format('SELECT COALESCE(jsonb_agg(t), ''[]''::jsonb) FROM (%s) t', q)
    INTO result;

  RETURN COALESCE(result, '[]'::jsonb);
END;
$$;
