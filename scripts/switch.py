import sys
import RPi.GPIO as GPIO
from config import config

def read(pin):
	GPIO.setwarnings(False)
	GPIO.setmode(GPIO.BCM)
	GPIO.setup(pin, GPIO.OUT)
	state = GPIO.input(pin)
	return status(json(pin, state))

def readall():
	answer = ""
	GPIO.setwarnings(False)
	GPIO.setmode(GPIO.BCM)
	for pin in config.pins:
		GPIO.setup(int(pin), GPIO.OUT)
		state = GPIO.input(int(pin))
		answer += json(pin, state) + ","
	return status(answer[:-1])

def write(pin, state):
	GPIO.setwarnings(False)
	GPIO.setmode(GPIO.BCM)
	GPIO.setup(pin, GPIO.OUT)
	start = GPIO.input(pin)
	GPIO.output(pin, state)
	state = GPIO.input(pin)
	return status(json(pin, state, start))

def json(pin, state, start=-1):
	return """{{"number":{0},"state":{1},"start":{2}}}""".format(pin, state, start)

def status(json):
	return """{{"pins":[{0}]}}""".format(json)

def cleanup():
	GPIO.setwarnings(False)
	GPIO.cleanup()
	print "cleanup"

def writeOptions():
	if len(sys.argv) == 4 and sys.argv[2] in config.pins and sys.argv[3] in config.states:
		print(write(int(sys.argv[2]), int(sys.argv[3])))
	else:
		print status("")

def readOptions():
	if len(sys.argv) == 3 and sys.argv[2] in config.pins:
		print read(int(sys.argv[2]))
	elif len(sys.argv) == 3 and sys.argv[2] == "all":
		print readall()
	else:
		print status("")

if __name__ == "__main__":
	if len(sys.argv) == 2 and sys.argv[1] == "cleanup":
		cleanup()
	elif len(sys.argv) < 3:
		print status("")
	elif sys.argv[1] == "write":
		writeOptions()
	elif sys.argv[1] == "read":
		readOptions()
	else:
		print status("")

