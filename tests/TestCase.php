<?php

namespace Tests;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    use RefreshDatabase;
    protected function migrateFreshUsing()
    {
        return [
            '--path' => 'tests/database/migrations',
            '--database' => 'sqlite_testing',
        ];
    }
}
