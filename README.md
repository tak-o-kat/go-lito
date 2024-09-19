# Go-lito (Go Lee Toe)

Go-lito is a small project specifically created for those running algod on a Linux system that uses Systemd. It is used to assist in collecting extra data from the local node that does not get propagated to algod or indexers and thus never gets collected.

---

## Introduction

The app go-lito is more of a collection of apps that assist node (algod) runners collect log data that normally gets cycled and removed. By collecting this data we can use the information to display information that is normally not kept by nodes, archive nodes or indexers. In essense go-lito is a log archiver for your algorand participation node.

## Tech Stack

Currently go-lito uses the following technologies to store the data and display the data to the a node runner:

- Golang -> Go-lito is compiled on an x86_64 using Ubuntu

  - Used to continuously monitor the archive.node.log file
  - Captures all the archive logs when the archive file is rotated
  - Provides RESTful API's

- SQLite 3

  - Easy to use database file that works really well for this use case

- NextJs 14 -> Next-lito is used to display data in a web UI

  - Gives user's the ability to view their log data in a simple web UI
  - Allows for multiple themes
  - Requires user name and password for basic security

- Tailscale (optional)
  - Used to view Lito securely through a local VPN

The following are future endeavours for the project:

- Installation Scripts

  - Bash Scripts to assist users with installing go-lito and next-lito

- Grafana

  - Allow users to use their own grafana dashboard

- SolidStart - Solid-lito

  - An alternative to NextJS. Another web UI

- Docker Containers
  - for Go-lito and SQLite
  - for Next-Lito and Solid-lito

## Go-lito installation

The following instructions are only for go-lito, which will run on your node and collect your log data.

It's recommended you firt try and run go-lito manually before using systemd or unit files. Here are the manual instructions:

Create a new folder called lito, preferably in your home folder, and change directories into it.

```
mkdir lito && cd lito
```

Download the latest go-lito binary:

```
wget https://github.com/tak-o-kat/go-lito/releases/download/v0.1.5-beta/lito.tar.bz2
```

The bzip file willnot need to extracted

```
tar xjvf lito.tar.bz2
```

This will give you 3 files and 1 of them is hidden

- lito (exectualbe)
- .env.example (env file manual use only)
- lito.service (unit file)

For the manual install first thing is to make a copy of your .env.example to .env

```
cp .env.example .env
```

Now we are ready to try out lito, **make sure you have ALGORAND_DATA variable set or lito will not work!**

First take a look at all the options for the lito daemon:

```
./lito deamon -h
```

The majority of these options are for development and test, but some like the --server, --port, and --net can be used by node runners

The network interface is set to default of 127.0.0.1, meaning if you turn on the server (API) funcitonality it will only serve those requests locally.

**If you're running a cloud VPS I do not recommend opening up your network interface (0 or 0.0.0.0), it does not have any security set and it is meant for users that run nodes in their local network!** If you do open it up, I'm assuming your VPS has a default firewall set up so you will need to implicitly allow port 8081 or whatever port you changed it to.

Start up lito

```
./lito daemon -s
```

This will start lito without the api server. The lito logger should display some output to the stdout. Please make sure there are no errors and the data displayed is correct. You should only see INF, DBG, and WRN (in case DB does not exist) log data. Cancel the manual start

`ctrl + c` (you don't type this, you just hit those keys on your keyboard)

If all is well you may start have systemd start your lito file. First open up the lito.service file that was extracted from the bzip file

```
vim lito.service
```

or

```
nano lito.service
```

The following lines will need to be changed to point to your lito direcotry:

```
User=takokat
...
ExecStart=/location/of/lito daemon -s
WorkingDirectory=/location/of/lito
```

It will look like the following:

```
ExecStart=/home/tako/lito/lito daemon -s
WorkingDirectory=/home/tako/lito
```

Swap `tako` for your username. Save and exit!

Next we will copy the lito.service to the systemd folder and reload the systemctl daemon

```
cp lito.service /etc/systemd/system && sudo systemctl daemon-reload
```

Enable the systemctl service

```
sudo systemctl enable lito.service
```

Start the lito service

```
sudo systemctl start lito.service
```

Check to make sure it's running properly:

```
systemctl status lito.service
```

![Lito Serivce](https://raw.githubusercontent.com/tak-o-kat/go-lito/refs/heads/main/images/lito-service.png)

If you do not see the above something went wrong and you will need to troubleshoot

Congrats Lito is now ready to go, it will automatically start on it's own even if you reboot!
