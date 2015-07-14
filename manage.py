#!/usr/bin/env python
# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals

import os
import sys

if __name__ == "__main__":
    sys.path.append(os.path.dirname(__file__))
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "test_proj.settings")

    from django.core.management import execute_from_command_line

    execute_from_command_line(sys.argv)
