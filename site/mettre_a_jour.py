# Régénère data.js depuis exercices/ : python mettre_a_jour.py
import subprocess,sys,os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
subprocess.run([sys.executable,'generer_data.py'],check=True)
