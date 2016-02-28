iniPath=$PWD
logColorInfo='\033[1;34m'
logColorSuccess='\033[0;32m'
logColorError='\033[0;31m'
logColorEnd='\033[0m'

serverOnly=0

if [ "$1" = "" ]; then
	echo "missing plugin name"
	exit -1;
fi
for param in "$@"
do
	if [ "$param" == "--serverOnly" ]; then
		echo "server only"
		serverOnly=1
	fi
done

for plugin in "$@"
do
	if [ "$plugin" == "--serverOnly" ]; then
		continue;
	fi
	plugin="homyPi-server-$plugin"
	printf "${logColorInfo}Trying to build $plugin${logColorEnd}\n"
	path=/home/nolitsou/Documents/dev/homyPi/homyPi_plugins/$plugin
	printf ${logColorInfo}$path${logColorEnd}"\n"
	if [ ! -d "$path" ]; then
		printf "${logColorError}unknown plugin $plugin${logColorEnd}\n"
		exit -1;
	else
		cd $path
		if [ $serverOnly == 0 ]; then
			npm run build
			if [ $? -eq 0 ]; then
				printf "${logColorSuccess}$plugin successfully builded${logColorEnd}\n"
				if [ -d "$path" ]; then
					printf "${logColorInfo}copy $path/public to $iniPath/node_modules/$plugin${logColorEnd}\n"
					cp $path/public $iniPath/node_modules/$plugin -Rf
					printf "${logColorInfo}copy $path/server to $iniPath/node_modules/$plugin${logColorEnd}\n"
					cp $path/server $iniPath/node_modules/$plugin -Rf
				fi
			else
				echo "${logColorError}Failed to build $plugin${logColorEnd}\n"
				exit -1;
			fi
		else
			printf "${logColorInfo}copy $path/server to $iniPath/node_modules/$plugin${logColorEnd}\n"
			cp $path/server $iniPath/node_modules/$plugin -Rf
		fi 
	fi
done
cd $iniPath
if [ $serverOnly == 0 ]; then
	npm start
else
	npm run server
fi
