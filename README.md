# Config du serveur en carton

## Utilisateurs

3 utilisateurs:
root, admin, docker 

+ 1 utilisateur en plus pour recevoir les certs du nas: 
cert-syno
(ne pas oublier de restreindre ses droits le plus possible (/bin/bashr))

Penser à installer sudo et à ajouter admin au groupe sudo

```bash
adduser --shell /bin/bash --disabled-password admin sudo
cp -r /root/.ssh/ /home/admin/.ssh
chown admin:admin -R /home/admin/.ssh/
apt install sudo
adduser admin sudo
```

Pour sudo sans mot de passe:

```bash
visudo /etc/sudoers
```

Ajouter la ligne suivante:

```bash
admin ALL=(ALL) NOPASSWD: ALL
```

Générer une paire de clé ssh ed25519 pour admin:

```bash
ssh-keygen -t ed25519
```

Plus qu'à ajouter la clé publique à ce repo

## Pour vscode

```bash
dpkg-reconfigure locales
# Choisir en_US.UTF-8
```

## Pour changer le port ssh

```bash
nano /etc/ssh/sshd_config
nano /etc/systemd/system/sockets.target.wants/ssh.socket
```

## Pour les VMs

installer qemu-guest-agent

```bash
sudo apt-get install qemu-guest-agent
sudo systemctl start qemu-guest-agent
```

créer un dossier docker_data

```bash
sudo mkdir /docker_data && sudo chown root:root /docker_data
sudo mkfs.ext4  /dev/sdb
sudo nano /etc/fstab
sudo systemctl daemon-reload
sudo mount -a

sudo nano /etc/docker/daemon.json
```

```json
{
  "data-root": "/docker_data"
}
```

```bash
sudo mv /var/lib/docker/* /docker_data/
sudo systemctl restart docker
```

```bash
sudo rm /etc/containerd/config.toml
sudo systemctl restart containerd
```

Penser à ajouter un mountpoint pour /data et /data_alt

## Pour gitea il faut ajouter l'utilisateur git

`adduser --system --shell /bin/bash --gecos 'Git Version Control' --group --disabled-password --home /home/git git`

Exim4 est remplacé par dma pour le serveur mail
