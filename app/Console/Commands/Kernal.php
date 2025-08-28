<?php

namespace App\Console\Commands;

class Kernel
{
    protected $commands = [
        \App\Console\Commands\SyncBricklinkColorsCategories::class,
    ];
}