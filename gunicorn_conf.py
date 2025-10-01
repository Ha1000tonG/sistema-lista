# gunicorn_conf.py
import multiprocessing

# Define o número de workers com base nos núcleos da CPU
workers = multiprocessing.cpu_count() * 2 + 1

# Define o diretório de trabalho para a pasta 'backend'
# Esta é a linha que resolve o problema de importação!
chdir = 'backend'
