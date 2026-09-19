import importlib.util
import io
import pathlib
import unittest
import zipfile
from unittest.mock import patch

spec=importlib.util.spec_from_file_location('worker',pathlib.Path(__file__).parents[1]/'scripts/inquiry_worker.py')
worker=importlib.util.module_from_spec(spec)
spec.loader.exec_module(worker)

class FileBoundaryTests(unittest.TestCase):
    def test_mime_spoofing(self):
        for extension in ['jpg','png','pdf','webp','docx','xlsx','pptx']:
            self.assertFalse(worker.validate_file(b'MZ executable',extension))
    def test_utf8_text(self):
        self.assertTrue(worker.validate_file('仕様书\n'.encode(),'txt'))
        self.assertFalse(worker.validate_file(b'abc\x00def','txt'))
    def office(self,extra=None):
        data=io.BytesIO()
        with zipfile.ZipFile(data,'w') as z:
            z.writestr('[Content_Types].xml','<Types/>')
            z.writestr('word/document.xml','<document/>')
            if extra:z.writestr(extra,'x')
        return data.getvalue()
    def test_document_family_mismatch(self):
        self.assertTrue(worker.validate_file(self.office(),'docx'))
        self.assertFalse(worker.validate_file(self.office(),'xlsx'))
    def test_macros_and_traversal(self):
        self.assertFalse(worker.validate_file(self.office('word/vbaProject.bin'),'docx'))
        self.assertFalse(worker.validate_file(self.office('../escape'),'docx'))
    def test_scanner_errors_never_mark_clean(self):
        with patch.object(worker.subprocess,'run',return_value=type('R',(),{'returncode':2})()):
            with self.assertRaises(RuntimeError):worker.scan_file(b'plain text','txt')
    def test_malware_result_rejected(self):
        with patch.object(worker.subprocess,'run',return_value=type('R',(),{'returncode':1})()):
            self.assertEqual(worker.scan_file(b'plain text','txt'),'rejected')
    def test_tick_headers_add_optional_vercel_automation_bypass(self):
        with patch.dict(worker.os.environ,{'INQUIRY_WORKER_TOKEN':'worker-token','INQUIRY_VERCEL_AUTOMATION_BYPASS_SECRET':'preview-bypass'},clear=False):
            headers=worker.tick_headers()
        self.assertEqual(headers['Authorization'],'Bearer worker-token')
        self.assertEqual(headers['x-vercel-protection-bypass'],'preview-bypass')
    def test_tick_headers_do_not_invent_bypass(self):
        with patch.dict(worker.os.environ,{'INQUIRY_WORKER_TOKEN':'worker-token','INQUIRY_VERCEL_AUTOMATION_BYPASS_SECRET':''},clear=False):
            headers=worker.tick_headers()
        self.assertNotIn('x-vercel-protection-bypass',headers)
    def test_query_value_encodes_positive_timezone_offset(self):
        encoded=worker.query_value('2026-09-18T20:43:04+00:00')
        self.assertEqual(encoded,'2026-09-18T20:43:04%2B00:00')
        self.assertNotIn('+',encoded)
        self.assertNotIn(' ',encoded)

if __name__=='__main__': unittest.main()
