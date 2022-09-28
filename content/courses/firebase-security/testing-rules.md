---
title: Write Tests
description: Write unit tests with mock data for Firestore Security Rules. 
weight: 42
lastmod: 2020-11-20T10:11:30-02:00
draft: false
vimeo: 486474624
emoji: 🧪
video_length: 4:00
---

{{< file "terminal" "command line" >}}
```bash
firebase emulators:start
```


{{< file "js" "rules.test.js" >}}
```javascript
describe('Database rules', () => {
    let db;
  
    // Applies only to tests in this describe block
    beforeAll(async () => {
      db = await setup(mockUser, mockData);
    });
  
    afterAll(async () => {
      await teardown();
    });
  
    test('deny when reading an unauthorized collection', async () => {
      const ref = db.collection('secret-stuff');

      expect( await assertFails( ref.get() ) );
  
    });

    test('allow admin to read unpublished posts', async () => {
      const ref = db.doc('posts/abc');

      expect( await assertSucceeds( ref.get() ) );
  
    });

    test('allow admin to update posts of other users', async () => {
      const ref = db.doc('posts/abc');

      expect( await assertSucceeds( ref.update({ published: true }) ) );
  
    });
    
  });
```