from locust import Locust, TaskSet, task, HttpLocust
from users import *
import logging, sys



class feedback(TaskSet):

	@task(10)
	def feedPage(self):
		response = self.client.get("/feedback")

		# print(response.content)

	@task(5)
	def stop(self):
		self.interrupt()





class toolPage(TaskSet):
	# tasks = {feedback: 2}


	def on_start(self):
		limit = 500 - 500

		if len(USERS) > limit:
			username, password = USERS.pop()
			response = self.client.post("/login", data={"username": username, "password": password})
			# self.client.get("/login-redirect")
			print(response.content)


	@task(10)
	def toolUpload(self):
		with open('a4.c', 'rb') as file:

			test = self.client.post("/tool_upload", files={'files': file}, data={ 'tool-./tools/programmingTools/c_tools/programmingParser.py':
			  [ 'GCC Diagnostics',
			    'Clang Diagnostics',
			    'Code Quality Checker' ],
			 'enabled-GCC Diagnostics': 'true',
			 'opt-gccLanguageStd': 'c99',
			 'opt-gccCompilerFlags': '',
			 'opt-clangLanguageStd': 'c99',
			 'opt-clangCompilerFlags': '',
			 'opt-cppCheckErrorLevel': 'all',
			 'opt-cppCheckLanguageStd': 'c99',
			 'tool-./tools/programmingTools/c_tools/includecheck.py': '#Include Path Checker',
			 'tool-./tools/programmingTools/c_stats/stats.py': 'Statistics',
			 'tool-./tools/programmingTools/python_tools/pythonParser.py': 'Python Formatting',
			 'opt-pythonStandard': 'python3',
			 'time': '1531856360202',
			 'fileList': '["a4.c"]' })


class MyLocust(HttpLocust):
    task_set = toolPage
    min_wait = 10000
    max_wait = 30000
