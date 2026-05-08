.PHONY: update build serve clean

update:
	hugo mod get -u
	hugo mod tidy

build:
	hugo

serve:
	hugo server

clean:
	rm -rf public resources
