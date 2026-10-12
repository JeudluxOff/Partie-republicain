import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
const env = {...process.env};
for (const key of ['DATABASE_URL', 'ADMIN_PASSWORD', 'SESSION_SECRET', 'BLOB_READ_WRITE_TOKEN']) delete env[key];
const child = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', '3187'], {env, stdio: ['ignore','pipe','pipe']});
let output = '';
const timeout = setTimeout(() => {console.error('Délai de test dépassé'); child.kill(); process.exitCode = 1;}, 45000);
try {
  await new Promise((resolve,reject) => {
    child.stdout.on('data', data => {output += data; if(output.includes('Ready')) resolve();});
    child.stderr.on('data', data => process.stderr.write(data));
    child.once('error', reject);
    child.once('exit', code => reject(new Error('Arrêt prématuré : '+code)));
  });
  for (const path of ['/', '/suivi', '/accueil', '/programme', '/equipe', '/actualites', '/adherer', '/admin', '/connexion', '/mentions', '/equipe/profil-test', '/actualites/annonce-test']) {
    const res = await fetch('http://127.0.0.1:3187'+path);
    assert.equal(res.status, 200, path);
    assert.match(await res.text(), /Union Civique|UNION CIVIQUE/, path);
    console.log('OK 200 '+path);
  }
  const data = await fetch('http://127.0.0.1:3187/api/data');
  assert.equal(data.status, 200);
  const payload = await data.json();
  assert.equal(payload.isAdmin, false);
  assert.ok(payload.content.name);
  for (const path of ['/inconnue', '/programme/sous-page-inexistante']) {
    assert.equal((await fetch('http://127.0.0.1:3187'+path)).status, 404);
    console.log('OK 404 '+path);
  }
  assert.equal((await fetch('http://127.0.0.1:3187/api/admin')).status, 403);
  const image = await fetch('http://127.0.0.1:3187/images/equipe-union-civique.png');
  assert.equal(image.status, 200);
  assert.match(image.headers.get('content-type'), /image\/png/);
  console.log('OK API publique, dossiers protégés et image. Tests de production réussis.');
} catch (error) {console.error(error); process.exitCode = 1;}
finally {clearTimeout(timeout); const exited = once(child, 'exit'); child.kill(); await exited;}
