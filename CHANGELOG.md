#### 1.1.2 (2024-08-10)

##### Chores

* **refacto:**  admin home route (59fd122e)
*  add sentry config (42ed633a)
*  gh-actions & eslint (not ready) (7dd84846)
*  initial project (aff77f40)

##### New Features

*  add report growth chart to admin dashboard (a575da59)
*  admin screenshots route (dcddd53b)
*  reports screenshots (c6afb2be)
*  reports migration & models (703231a2)
*  get stats by lastTimeWindow (04861068)
*  upload screenshot from screenMe software (e57e92fb)
* **admin:**  reports action (close / delete) (0d15a06c)
* **chore:**  report screenshot system (d5e20e4a)
* **adm:**
  *  user growth chart route (7a29bc47)
  *  user gallery (d427338b)
  *  home & users routes (bc1e5822)
  *  users list (74e9045c)
  *  home route (retrieve stats) (b1ff3b74)
* **ws:**  send websocket to client on auth (098173d4)

##### Bug Fixes

*  add adminId in reports (d5346c02)
*  screenshot url in SSR page (985a4990)
*  users quota formula (62957be2)
*  screenshot upload file type & size check (68e16a70)
*  gallery route + add some fields in db (bbf803fb)
*  user migration typo (34c132d0)
* **tables:**  update reports table, add solvedReason field (d14302f2)
* **admin:**  date format (8538cadc)
* **adm:**
  *  users growth charts (af84e830)
  *  wrong users quota when have 0 screenshots (7d634d0d)

##### Other Changes

*  improve query handling in screenshots endpoint (23e9430a)
*  Bump backend version to 1.1.1 (d6fa5b06)
*  handle titles correctly in screenshot upload (1b0f2ee9)
*  Add route to calculate screenshot directory size (a74f5127)
*  rename router to screenshotsRouter (8ba781c7)
*  add bulk screenshot upload endpoint (2f4638e8)
*  increase rate limit to handle higher traffic (fd05d350)
*  Add screenshots association to User model (d6ea85d8)
*  add profile endpoint for user details and statistics (03e122b9)
*  seo ssr (21666783)
*  count all screenshots route + return screenshot id in upload route (d6809f9a)

#### 1.0.1 (2024-08-09)

##### Chores

* **refacto:**  admin home route (59fd122e)
*  add sentry config (42ed633a)
*  gh-actions & eslint (not ready) (7dd84846)
*  initial project (aff77f40)

##### New Features

*  add report growth chart to admin dashboard (a575da59)
*  admin screenshots route (dcddd53b)
*  reports screenshots (c6afb2be)
*  reports migration & models (703231a2)
*  get stats by lastTimeWindow (04861068)
*  upload screenshot from screenMe software (e57e92fb)
* **admin:**  reports action (close / delete) (0d15a06c)
* **chore:**  report screenshot system (d5e20e4a)
* **adm:**
  *  user growth chart route (7a29bc47)
  *  user gallery (d427338b)
  *  home & users routes (bc1e5822)
  *  users list (74e9045c)
  *  home route (retrieve stats) (b1ff3b74)
* **ws:**  send websocket to client on auth (098173d4)

##### Bug Fixes

*  add adminId in reports (d5346c02)
*  screenshot url in SSR page (985a4990)
*  users quota formula (62957be2)
*  screenshot upload file type & size check (68e16a70)
*  gallery route + add some fields in db (bbf803fb)
*  user migration typo (34c132d0)
* **tables:**  update reports table, add solvedReason field (d14302f2)
* **admin:**  date format (8538cadc)
* **adm:**
  *  users growth charts (af84e830)
  *  wrong users quota when have 0 screenshots (7d634d0d)

##### Other Changes

*  handle titles correctly in screenshot upload (1b0f2ee9)
*  Add route to calculate screenshot directory size (a74f5127)
*  rename router to screenshotsRouter (8ba781c7)
*  add bulk screenshot upload endpoint (2f4638e8)
*  increase rate limit to handle higher traffic (fd05d350)
*  Add screenshots association to User model (d6ea85d8)
*  add profile endpoint for user details and statistics (03e122b9)
*  seo ssr (21666783)
*  count all screenshots route + return screenshot id in upload route (d6809f9a)

