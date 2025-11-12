# 🧪 Guide de Test - LCVB Scoreboard Pro

## ✅ Problème Résolu

Le problème était que les fichiers HTML pointaient vers `http://192.168.1.40:3000` (backend interne) au lieu de `http://192.168.1.40:5700` (Nginx qui fait le proxy).

**Correction appliquée** : Tous les fichiers HTML utilisent maintenant le port **5700**.

---

## 🌐 Comment Tester l'Application

### Méthode 1 : Depuis Votre Navigateur

1. **Ouvrez votre navigateur** (Chrome, Firefox, Safari...)

2. **Accédez à** : http://192.168.1.40:5700/login.html

3. **Connectez-vous avec** :
   - Email : `test@test.com`
   - Mot de passe : `test@test.com`

4. **Vous devriez voir** :
   - La page de login se charger correctement
   - Pas d'erreur "Impossible de se connecter au serveur"
   - Après login, redirection vers home.html

---

### Méthode 2 : Test Depuis la Console du Navigateur

1. Ouvrez http://192.168.1.40:5700/login.html

2. Ouvrez la **Console** (F12 > Console)

3. Tapez cette commande :

```javascript
fetch('http://192.168.1.40:5700/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        email: 'test@test.com',
        password: 'test@test.com'
    })
})
.then(r => r.json())
.then(d => console.log('✅ Login OK:', d))
.catch(e => console.error('❌ Erreur:', e));
```

4. **Résultat attendu** :
```
✅ Login OK: { success: true, token: "eyJ..." }
```

---

### Méthode 3 : Test depuis Terminal (ligne de commande)

```bash
# Test 1 : Page accessible
curl -s -o /dev/null -w "Status: %{http_code}\n" http://192.168.1.40:5700/login.html

# Test 2 : API Login
curl -X POST http://192.168.1.40:5700/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test@test.com"}' | jq .

# Test 3 : Vérifier les logs
ssh admin@192.168.1.40 "sudo docker logs lcvb-container --tail 20"
```

---

## ❌ Si Vous Voyez Encore "Impossible de se connecter..."

### Vérifications à Faire

1. **Container en cours d'exécution ?**
```bash
ssh admin@192.168.1.40 "sudo docker ps | grep lcvb"
```
Vous devriez voir : `lcvb-container ... Up X minutes ... 0.0.0.0:5700->5700/tcp`

2. **Vérifier les logs pour erreurs**
```bash
ssh admin@192.168.1.40 "sudo docker logs lcvb-container" | grep -i error
```

3. **Backend démarré correctement ?**
```bash
ssh admin@192.168.1.40 "sudo docker logs lcvb-container" | grep "Serveur démarré"
```
Vous devriez voir : `🌐 Serveur démarré sur http://localhost:3000`

4. **Test direct de l'API**
```bash
curl http://192.168.1.40:5700/api/teams
```
Vous devriez voir : `{"error":"Token manquant"}`
(C'est normal, ça prouve que l'API répond)

---

## 🔍 Comprendre l'Architecture

```
Votre Navigateur
     ↓
http://192.168.1.40:5700  ← Port public exposé
     ↓
   Nginx (container Docker)
     ↓
   - /login.html → Fichiers statiques
   - /api/* → Proxy vers backend
     ↓
http://localhost:3000  ← Backend Node.js (interne au container)
     ↓
PostgreSQL (192.168.1.40:5433)
```

**Important** : 
- Le port **5700** est le SEUL port accessible depuis l'extérieur
- Le port **3000** n'est accessible QUE depuis l'intérieur du container
- Nginx fait le proxy entre les deux

---

## 📱 Pages à Tester

Après connexion, testez ces pages :

1. ✅ http://192.168.1.40:5700/login.html - Connexion
2. ✅ http://192.168.1.40:5700/home.html - Hub principal
3. ✅ http://192.168.1.40:5700/teams.html - Gestion équipes
4. ✅ http://192.168.1.40:5700/setup.html - Configuration match
5. ✅ http://192.168.1.40:5700/lineups.html - Compositions "7 de base"
6. ✅ http://192.168.1.40:5700/control.html - Contrôle match
7. ✅ http://192.168.1.40:5700/display.html - Affichage public

---

## 🆘 Besoin d'Aide ?

Si après ces vérifications le problème persiste :

1. **Capturez les logs** :
```bash
ssh admin@192.168.1.40 "sudo docker logs lcvb-container" > logs.txt
```

2. **Ouvrez la Console du navigateur** (F12) et copiez les erreurs

3. **Vérifiez votre réseau** :
   - Êtes-vous sur le même réseau que le NAS (192.168.1.x) ?
   - Pouvez-vous ping le NAS ? `ping 192.168.1.40`

---

## ✅ Checklist de Validation

- [ ] Page de login se charge (pas d'erreur 404)
- [ ] Formulaire de login visible
- [ ] Connexion avec test@test.com fonctionne
- [ ] Redirection vers home.html après login
- [ ] Pas d'erreur "Impossible de se connecter" dans la console
- [ ] API répond (voir Network tab dans F12)

Si tous ces points sont OK, **l'application fonctionne correctement** ! 🎉
