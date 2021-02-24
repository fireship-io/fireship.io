---
title: Form Validation
description: Add form validation with react-hook-forms
weight: 43
lastmod: 2021-02-01T10:23:30-09:00
draft: false
vimeo: 508694601
emoji: ⚛️
video_length: 2:02
---

## Form Validation

React Hook Form makes it easy to add reactive form validation. 

{{< file "js" "pages/admin/slug.js" >}}
```jsx

  const { register, handleSubmit, reset, watch, formState, errors } = useForm({ defaultValues, mode: 'onChange' });

  const { isValid, isDirty } = formState;

// ...

      <textarea name="content" ref={register({
            maxLength: { value: 20000, message: 'content is too long' },
            minLength: { value: 10, message: 'content is too short' },
            required: { value: true, message: 'content is required'}
          })}>
      </textarea>

        {errors.content && <p className="text-danger">{errors.content.message}</p>}

        <button type="submit" disabled={!isDirty || !isValid}>
          Save Changes
        </button>
```