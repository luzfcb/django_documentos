from redactor.handlers import DateDirectoryUploader, UUIDUploader


class DateDirectoryWithUUIDUploader(UUIDUploader, DateDirectoryUploader):
    pass
