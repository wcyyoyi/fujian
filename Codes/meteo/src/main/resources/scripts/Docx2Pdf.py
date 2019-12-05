import  os
from sys import argv
from win32com import client

def doc2pdf(doc_name, pdf_name):
    try:
        word = client.DispatchEx("Word.Application")
        if os.path.exists(pdf_name):
            os.remove(pdf_name)
        worddoc = word.Documents.Open(doc_name,ReadOnly = 1)
        worddoc.SaveAs(pdf_name, FileFormat = 17)
        worddoc.Close()
        return pdf_name
    except:
        return 1

if __name__=='__main__':
    doc_name = argv[1]
    ftp_name = argv[2]
    doc2pdf(doc_name, ftp_name)