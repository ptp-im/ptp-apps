#!/bin/sh

CUR_DIR=
get_cur_dir() {
    # Get the fully qualified path to the script
    case $0 in
        /*)
            SCRIPT="$0"
            ;;
        *)
            PWD_DIR=$(pwd);
            SCRIPT="${PWD_DIR}/$0"
            ;;
    esac
    # Resolve the true real path without any sym links.
    CHANGED=true
    while [ "X$CHANGED" != "X" ]
    do
        # Change spaces to ":" so the tokens can be parsed.
        SAFESCRIPT=`echo $SCRIPT | sed -e 's; ;:;g'`
        # Get the real path to this script, resolving any symbolic links
        TOKENS=`echo $SAFESCRIPT | sed -e 's;/; ;g'`
        REALPATH=
        for C in $TOKENS; do
            # Change any ":" in the token back to a space.
            C=`echo $C | sed -e 's;:; ;g'`
            REALPATH="$REALPATH/$C"
            # If REALPATH is a sym link, resolve it.  Loop for nested links.
            while [ -h "$REALPATH" ] ; do
                LS="`ls -ld "$REALPATH"`"
                LINK="`expr "$LS" : '.*-> \(.*\)$'`"
                if expr "$LINK" : '/.*' > /dev/null; then
                    # LINK is absolute.
                    REALPATH="$LINK"
                else
                    # LINK is relative.
                    REALPATH="`dirname "$REALPATH"`""/$LINK"
                fi
            done
        done

        if [ "$REALPATH" = "$SCRIPT" ]
        then
            CHANGED=""
        else
            SCRIPT="$REALPATH"
        fi
    done
    # Change the current directory to the location of the script
    CUR_DIR=$(dirname "${REALPATH}")
}

get_cur_dir
PIC_DIR=$CUR_DIR/../assets/logo

run() {
  echo "convert $PIC_DIR/intro_tg_plane.png -resize $1 $PIC_DIR/intro_tg_plane_$1.png"
  convert $PIC_DIR/intro_tg_plane.png -resize $1 $PIC_DIR/intro_tg_plane_$1.png
  echo "mv $PIC_DIR/intro_tg_plane_$1.png $PIC_DIR/../../../PtpIm/android_client/app/src/main/res/drawable-$2/intro_tg_plane.png"
  mv $PIC_DIR/intro_tg_plane_$1.png $PIC_DIR/../../../PtpIm/android_client/app/src/main/res/drawable-$2/intro_tg_plane.png
}

run 82x74 mdpi
run 123x111 hdpi
run 164x148 xhdpi
run 264x222 xxhdpi
